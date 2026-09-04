import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Analyze Single Mock Endpoint
app.post('/api/analyze-mock', async (req, res) => {
  try {
    const { currentMock, previousMocks = [] } = req.body;

    if (!currentMock) {
      return res.status(400).json({ error: 'currentMock data is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is provided in settings.',
      });
    }

    const hasPreviousMocks = Array.isArray(previousMocks) && previousMocks.length > 0;

    const systemInstruction = `You are CLATCracker AI, a precision analytical mentor for CLAT (Common Law Admission Test for Indian National Law Universities).
CRITICAL RULES:
1. ONLY make conclusions from data actually entered. Never invent numbers, sections, or patterns.
2. If there is only ONE mock (no previous mocks), DO NOT claim any weakness is recurring. Explicitly state that this is baseline mock data.
3. Natural mistake analysis: Analyze the user's natural language mistake log thoroughly. Categorize each error type (Knowledge/concept gaps, Misreading, Careless errors, Poor elimination, Inference/comprehension problems, Calculation errors, Time pressure, Overthinking / second-guessing, Question selection problems, etc.).
4. After every mock, produce:
   - What went well (scores, time management, accuracy where high)
   - Biggest problems (root causes of lost marks)
   - Recurring patterns (ONLY if observed across multiple mocks, otherwise say "Baseline mock — recurring patterns will be identified once subsequent mocks are logged")
   - Time problems (section-wise time vs typical pacing of ~120 questions in 120 minutes)
   - Priority weaknesses (ranked high/medium/low with clear tactical root cause)
   - Specific things to practise (concrete, direct practice tasks, e.g. "Do 4 inference-based passages without timer, then review elimination rationale")
5. If previous mocks are provided, compare with them to detect whether each major weakness is "repeating", "improving", "worsening", or "new".`;

    const promptData = {
      currentMock: {
        title: currentMock.title,
        date: currentMock.date,
        overallScore: currentMock.overallScore,
        totalTimeMinutes: currentMock.totalTimeMinutes,
        sections: currentMock.sections,
        mistakeLog: currentMock.mistakeLog || '(No detailed mistake log entered for this mock)',
      },
      previousMocksCount: previousMocks.length,
      previousMocksSummary: previousMocks.map((m: any) => ({
        title: m.title,
        date: m.date,
        overallScore: m.overallScore,
        sections: m.sections,
        mistakeLog: m.mistakeLog,
      })),
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Analyze this CLAT mock test rigorously based ONLY on the entered data:\n${JSON.stringify(promptData, null, 2)}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whatWentWell: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Points where the student performed well or made sound decisions.',
            },
            biggestProblems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Primary bottlenecks that caused score leakage.',
            },
            recurringPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Patterns observed across multiple mocks. If only 1 mock exists, specify baseline note.',
            },
            timeProblems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Analysis of section pacing and time distribution.',
            },
            priorityWeaknesses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  severity: { type: Type.STRING, description: 'high, medium, or low' },
                  description: { type: Type.STRING },
                },
                required: ['area', 'severity', 'description'],
              },
              description: 'Weaknesses prioritized by urgency.',
            },
            specificThingsToPractise: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Clear, actionable practice items.',
            },
            comparisonsWithPrevious: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weakness: { type: Type.STRING },
                  status: {
                    type: Type.STRING,
                    description: 'repeating, improving, worsening, or new',
                  },
                  note: { type: Type.STRING },
                },
                required: ['weakness', 'status', 'note'],
              },
              description: 'Evolution of weaknesses compared to previous mocks. Empty if no previous mocks.',
            },
            detectedPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Extracted mistake category tags (e.g. Overthinking, Misreading, Concept gap, Time pressure).',
            },
            summary: {
              type: Type.STRING,
              description: 'Brief, high-impact concluding diagnostic.',
            },
          },
          required: [
            'whatWentWell',
            'biggestProblems',
            'recurringPatterns',
            'timeProblems',
            'priorityWeaknesses',
            'specificThingsToPractise',
            'comparisonsWithPrevious',
            'detectedPatterns',
            'summary',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      analyzedAt: Date.now(),
    });
  } catch (err: any) {
    console.error('Error analyzing mock:', err);
    return res.status(500).json({
      error: err.message || 'Failed to analyze mock test.',
    });
  }
});

// 2. AI Priorities Generator Endpoint
app.post('/api/generate-priorities', async (req, res) => {
  try {
    const { mocks = [], logs = [] } = req.body;

    if ((!mocks || mocks.length === 0) && (!logs || logs.length === 0)) {
      return res.json({
        generatedAt: Date.now(),
        headline: 'No data recorded yet',
        dataSufficiencyNotice: 'You have not entered any mocks or study logs yet. CLATCracker only derives priorities from real data you enter. Log your first mock or daily study session to receive targeted priorities.',
        mismatches: [],
        priorities: [],
        tacticalAdvice: 'Begin by adding your latest mock test scores with section timings and your natural mistake log, or log today’s study activity.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured.',
      });
    }

    const systemInstruction = `You are CLATCracker's Core AI Priority Engine.
Your primary directive: Answer "Based on my performance and what I've actually been studying, what should I do next?"
CRITICAL DIRECTIVES:
1. Ground conclusions 100% in the entered mocks and daily study logs. Do NOT guess or hallucinate unrecorded study sessions.
2. If there are no daily study logs, state clearly that study logs have not been recorded yet, and base recommendations purely on mock weaknesses.
3. If there are no mocks, state clearly that mock results are missing, and base feedback on study balance.
4. DETECT MISMATCHES: Check if there is a disconnect between identified weaknesses in mocks (e.g. Quant timing, Legal elimination, LR assumptions) and the actual subjects/topics the user has been studying in their daily logs.
   Example: "Quant timing has been a recurring weakness, but you haven't done timed Quant practice recently. Prioritise this today."
5. Provide a short, highly practical list of priorities for "TODAY", numbered 1, 2, 3 (no bloated 10-item schedule).
   Format each with Subject, Priority ('High' | 'Medium' | 'Low'), actionable task (e.g., "2 inference passages + review Mock 5 mistakes"), and rationale citing the data mismatch or error pattern.`;

    const payload = {
      totalMocks: mocks.length,
      latestMock: mocks.length > 0 ? mocks[mocks.length - 1] : null,
      recentMocks: mocks.slice(-3).map((m: any) => ({
        title: m.title,
        date: m.date,
        overallScore: m.overallScore,
        sections: m.sections,
        mistakeLog: m.mistakeLog,
        aiAnalysis: m.aiAnalysis ? {
          priorityWeaknesses: m.aiAnalysis.priorityWeaknesses,
          recurringPatterns: m.aiAnalysis.recurringPatterns,
          timeProblems: m.aiAnalysis.timeProblems,
        } : undefined,
      })),
      totalLogs: logs.length,
      recentDailyLogs: logs.slice(-7).map((l: any) => ({
        date: l.date,
        content: l.content,
        subject: l.subject,
        timeSpentMinutes: l.timeSpentMinutes,
        questionsOrPassages: l.questionsOrPassages,
        notes: l.notes,
      })),
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate today's CLAT AI Study Priorities from this exact student record:\n${JSON.stringify(payload, null, 2)}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: {
              type: Type.STRING,
              description: 'Crisp summary headline of the student current situation and primary focus.',
            },
            dataSufficiencyNotice: {
              type: Type.STRING,
              description: 'Note if data is limited (e.g. only 1 mock or no study logs), explaining what is needed.',
            },
            mismatches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  identifiedNeed: { type: Type.STRING },
                  recentStudyTrend: { type: Type.STRING },
                },
                required: ['description', 'identifiedNeed', 'recentStudyTrend'],
              },
              description: 'Discrepancies between what needs improvement and what was actually studied.',
            },
            priorities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  priority: { type: Type.STRING, description: 'High, Medium, or Low' },
                  task: { type: Type.STRING, description: 'Specific, actionable task for today.' },
                  rationale: { type: Type.STRING, description: 'Why this task is prioritized based on mock mistakes or missing practice.' },
                },
                required: ['id', 'subject', 'priority', 'task', 'rationale'],
              },
              description: 'Short, practical list of 2 to 4 priorities for today.',
            },
            tacticalAdvice: {
              type: Type.STRING,
              description: 'Single high-impact rule of thumb for today study.',
            },
          },
          required: ['headline', 'mismatches', 'priorities', 'tacticalAdvice'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      generatedAt: Date.now(),
    });
  } catch (err: any) {
    console.error('Error generating priorities:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate AI priorities.',
    });
  }
});

// 3. Overall Progress & Mistake Pattern Synthesis Endpoint
app.post('/api/pattern-check', async (req, res) => {
  try {
    const { mocks = [], logs = [] } = req.body;

    if (!mocks || mocks.length === 0) {
      return res.json({
        hasData: false,
        message: 'No mock tests logged yet. Progress and pattern analysis requires at least one mock test.',
        recurringMistakes: [],
        currentStrengths: [],
        currentWeaknesses: [],
        improvedWeaknesses: [],
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured.',
      });
    }

    const systemInstruction = `You are CLATCracker's History & Pattern Analyst.
Analyze the student's mock history to extract:
1. Recurring mistake patterns across multiple mocks (e.g. Overthinking, Misreading, Careless calculation, Poor elimination, Time pressure, Question selection).
   RULE: If there is only ONE mock in the record, clearly declare: "Single mock recorded; recurring patterns require 2+ mocks to substantiate."
2. Current confirmed strengths (sections/skills consistently delivering solid marks).
3. Current priority weaknesses.
4. Weaknesses that have verifiably improved across mocks (e.g. timing improved, score jumped, fewer careless errors noted in recent mistake logs). If no improvement yet or only 1 mock, explicitly state so.`;

    const summaryPayload = {
      mockCount: mocks.length,
      mocks: mocks.map((m: any) => ({
        id: m.id,
        title: m.title,
        date: m.date,
        overallScore: m.overallScore,
        totalTimeMinutes: m.totalTimeMinutes,
        sections: m.sections,
        mistakeLog: m.mistakeLog,
      })),
      logsCount: logs.length,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Synthesize pattern recognition and progress trajectory from this CLAT record:\n${JSON.stringify(summaryPayload, null, 2)}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasData: { type: Type.BOOLEAN },
            recurringMistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pattern: { type: Type.STRING },
                  frequencyCount: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  remedy: { type: Type.STRING },
                },
                required: ['pattern', 'frequencyCount', 'explanation', 'remedy'],
              },
            },
            currentStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            currentWeaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            improvedWeaknesses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  details: { type: Type.STRING },
                },
                required: ['area', 'details'],
              },
            },
            overallTrajectory: { type: Type.STRING },
          },
          required: [
            'hasData',
            'recurringMistakes',
            'currentStrengths',
            'currentWeaknesses',
            'improvedWeaknesses',
            'overallTrajectory',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in pattern-check:', err);
    return res.status(500).json({
      error: err.message || 'Failed to synthesize patterns.',
    });
  }
});

// Start server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CLATCracker server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
