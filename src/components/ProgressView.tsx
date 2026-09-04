import React, { useState } from 'react';
import { MockTest, DailyLog, CLAT_SECTIONS, SectionKey } from '../types';
import { 
  TrendingUp, 
  Clock, 
  Repeat, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  BarChart2
} from 'lucide-react';

interface ProgressViewProps {
  mocks: MockTest[];
  logs: DailyLog[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ mocks, logs }) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [aiSynthesis, setAiSynthesis] = useState<any | null>(null);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  const hasMocks = mocks.length > 0;
  const hasLogs = logs.length > 0;

  // Numerical calculations
  const scores = mocks.map((m) => m.overallScore);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '—';
  const highScore = scores.length > 0 ? Math.max(...scores).toFixed(2) : '—';
  const latestScore = scores.length > 0 ? scores[scores.length - 1].toFixed(2) : '—';

  const totalStudyMinutes = logs.reduce((a, b) => a + (b.timeSpentMinutes || 0), 0);

  // Trigger AI history analysis
  const runAiSynthesis = async () => {
    if (!hasMocks) return;
    setIsSynthesizing(true);
    setSynthesisError(null);
    try {
      const res = await fetch('/api/pattern-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mocks, logs }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to synthesize progress.');
      }
      const data = await res.json();
      setAiSynthesis(data);
    } catch (err: any) {
      setSynthesisError(err.message || 'Error checking patterns.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  if (!hasMocks && !hasLogs) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-[#24242A] bg-[#16161A]/40">
          <div className="w-12 h-12 rounded-xl bg-[#0C0C0E] border border-[#2D2D33] text-[#6366F1] flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif italic text-white">
            No Progress Data Available
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#8E8E9F] max-w-md mx-auto leading-relaxed font-sans">
            Progress analytics, score trajectories, and recurring mistake patterns are generated exclusively from your actual mock tests and daily logs.
          </p>
        </div>
      </div>
    );
  }

  // Calculate Section statistics
  const sectionStats = (Object.keys(CLAT_SECTIONS) as SectionKey[]).map((key) => {
    const sectionMarks = mocks.map((m) => m.sections[key]?.marks || 0);
    const sectionTimes = mocks.map((m) => m.sections[key]?.timeMinutes || 0);

    const avgMark = sectionMarks.length > 0 ? (sectionMarks.reduce((a, b) => a + b, 0) / sectionMarks.length).toFixed(1) : '0';
    const latestMark = sectionMarks.length > 0 ? sectionMarks[sectionMarks.length - 1] : 0;
    const avgTime = sectionTimes.length > 0 ? Math.round(sectionTimes.reduce((a, b) => a + b, 0) / sectionTimes.length) : 0;
    const latestTime = sectionTimes.length > 0 ? sectionTimes[sectionTimes.length - 1] : 0;

    return {
      key,
      meta: CLAT_SECTIONS[key],
      avgMark,
      latestMark,
      avgTime,
      latestTime,
    };
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24242A] pb-6">
        <div>
          <h1 className="text-2xl font-serif italic text-white tracking-tight">
            Progress & History
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E9F] mt-1 font-sans">
            Track mock score trajectory, section pacing, recurring mistakes, and verified improvements.
          </p>
        </div>

        {hasMocks && (
          <button
            onClick={runAiSynthesis}
            disabled={isSynthesizing}
            id="synthesize-patterns-btn"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs transition-colors shrink-0 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>{isSynthesizing ? 'Analyzing Trajectory...' : 'Synthesize AI Pattern History'}</span>
          </button>
        )}
      </div>

      {synthesisError && (
        <div className="p-4 bg-[#16161A] border border-rose-900/40 rounded-xl flex items-start space-x-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
          <span>{synthesisError}</span>
        </div>
      )}

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#24242A] bg-[#16161A] shadow-xs">
          <span className="text-xs font-medium text-[#8E8E9F]">Latest Score</span>
          <span className="text-2xl font-bold font-serif italic text-white block mt-1.5">
            {latestScore}
          </span>
          <span className="text-[11px] text-[#666675] mt-1 block truncate">
            {hasMocks ? mocks[mocks.length - 1].title : '—'}
          </span>
        </div>

        <div className="p-5 rounded-xl border border-[#24242A] bg-[#16161A] shadow-xs">
          <span className="text-xs font-medium text-[#8E8E9F]">Average Score</span>
          <span className="text-2xl font-bold font-serif italic text-white block mt-1.5">
            {avgScore}
          </span>
          <span className="text-[11px] text-[#666675] mt-1 block font-mono">
            Across {mocks.length} mock test{mocks.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="p-5 rounded-xl border border-[#24242A] bg-[#16161A] shadow-xs">
          <span className="text-xs font-medium text-[#8E8E9F]">Peak Score</span>
          <span className="text-2xl font-bold font-serif italic text-[#6366F1] block mt-1.5">
            {highScore}
          </span>
          <span className="text-[11px] text-[#666675] mt-1 block">Personal best</span>
        </div>

        <div className="p-5 rounded-xl border border-[#24242A] bg-[#16161A] shadow-xs">
          <span className="text-xs font-medium text-[#8E8E9F]">Total Study Logged</span>
          <span className="text-2xl font-bold font-serif italic text-white block mt-1.5">
            {Math.round(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m
          </span>
          <span className="text-[11px] text-[#666675] mt-1 block font-mono">
            {logs.length} logged session{logs.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Mock Score Progression Graph / Timeline */}
      {hasMocks && (
        <div className="p-6 rounded-xl border border-[#24242A] bg-[#16161A] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E8E9F] flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#6366F1]" />
                <span>Mock Score Progression</span>
              </h3>
              <span className="text-xs text-[#666675] mt-0.5 block">
                Score trajectory across all recorded mocks in chronological sequence
              </span>
            </div>
          </div>

          {/* Simple Clean Responsive SVG Chart */}
          <div className="pt-4">
            <div className="h-44 w-full flex items-end justify-between gap-2 border-b border-[#24242A] pb-2">
              {mocks.map((m, idx) => {
                const maxPossible = Math.max(120, ...scores);
                const heightPercent = Math.max(15, Math.round((m.overallScore / maxPossible) * 100));
                const isLatest = idx === mocks.length - 1;
                return (
                  <div key={m.id} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2.5 py-1 rounded bg-[#0C0C0E] border border-[#2D2D33] text-white text-[10px] whitespace-nowrap pointer-events-none z-10 font-mono shadow-md">
                      {m.title}: {m.overallScore} marks ({m.totalTimeMinutes}m)
                    </div>

                    <span className="text-[10px] font-bold mb-1 text-[#E0E0E6] font-mono">
                      {m.overallScore}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[42px] rounded-t-md transition-all ${
                        isLatest
                          ? 'bg-[#6366F1] shadow-xs'
                          : 'bg-[#24242A] hover:bg-[#6366F1]/70'
                      }`}
                    />
                    <span className="text-[10px] text-[#666675] truncate max-w-[50px] mt-1.5 font-mono" title={m.title}>
                      #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#666675] pt-2 font-mono">
              <span>First Mock ({mocks[0]?.date})</span>
              <span>Latest Mock ({mocks[mocks.length - 1]?.date})</span>
            </div>
          </div>
        </div>
      )}

      {/* Section-Wise Progress & Timing Breakdown */}
      {hasMocks && (
        <div className="p-6 rounded-xl border border-[#24242A] bg-[#16161A] shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E8E9F]">
              Section Performance & Timing Allocation
            </h3>
            <span className="text-xs text-[#666675] mt-0.5 block">
              Comparing latest mock performance against all-time averages
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {sectionStats.map((item) => (
              <div
                key={item.key}
                className="p-4 rounded-lg border border-[#24242A] bg-[#0C0C0E] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {item.meta.shortLabel}
                  </span>
                  <span className="text-[10px] text-[#666675] font-mono">
                    ~{item.meta.defaultQuestions} Qs
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-[#8E8E9F]">Latest:</span>
                    <strong className="text-white font-bold font-mono">{item.latestMark}</strong>
                  </div>
                  <div className="flex items-baseline justify-between text-xs text-[#666675]">
                    <span>Average:</span>
                    <span className="font-mono">{item.avgMark}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#24242A] space-y-1 text-xs">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#8E8E9F] flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#666675]" />
                      <span>Latest Time:</span>
                    </span>
                    <span className="font-semibold text-white font-mono">{item.latestTime}m</span>
                  </div>
                  <div className="flex items-baseline justify-between text-[#666675]">
                    <span>Avg Time:</span>
                    <span className="font-mono">{item.avgTime}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Synthesized Pattern History */}
      {aiSynthesis && (
        <div className="space-y-6">
          {/* Recurring Mistake Patterns Card */}
          <div className="p-6 rounded-xl border border-[#2D2D33] bg-[#16161A] space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <Repeat className="w-4 h-4 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                Recurring Mistake Patterns Across Mocks
              </h3>
            </div>

            {aiSynthesis.recurringMistakes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiSynthesis.recurringMistakes.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-[#24242A] bg-[#0C0C0E] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {p.pattern}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-950/60 text-amber-300 border border-amber-900/40">
                        {p.frequencyCount} occurrences
                      </span>
                    </div>
                    <p className="text-xs text-[#8E8E9F] leading-relaxed">
                      {p.explanation}
                    </p>
                    <div className="text-[11px] text-[#666675] pt-1.5 border-t border-[#24242A]">
                      <strong className="text-amber-400">Action: </strong>
                      {p.remedy}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8E8E9F] italic">
                {mocks.length <= 1
                  ? 'Only 1 mock recorded so far. A baseline was established — recurring patterns will be identified once subsequent mocks are logged.'
                  : 'No persistent recurring mistake patterns detected.'}
              </p>
            )}
          </div>

          {/* Current Strengths, Priority Weaknesses & Improved Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Strengths */}
            <div className="p-5 rounded-xl border border-emerald-900/30 bg-[#16161A] space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Current Strengths</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-200/90">
                {aiSynthesis.currentStrengths?.map((s: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Persistent Weaknesses */}
            <div className="p-5 rounded-xl border border-rose-900/30 bg-[#16161A] space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center space-x-1.5">
                <Flame className="w-4 h-4" />
                <span>Priority Weaknesses</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-200/90">
                {aiSynthesis.currentWeaknesses?.map((w: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improved Weaknesses */}
            <div className="p-5 rounded-xl border border-indigo-900/30 bg-[#16161A] space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6366F1] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Weaknesses Improved</span>
              </h4>
              {aiSynthesis.improvedWeaknesses && aiSynthesis.improvedWeaknesses.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {aiSynthesis.improvedWeaknesses.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-[#0C0C0E] rounded-lg border border-[#24242A]">
                      <strong className="text-white block">{item.area}</strong>
                      <span className="text-[#8E8E9F] text-[11px]">{item.details}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#666675] italic">
                  {mocks.length <= 1
                    ? 'Requires 2+ mocks to substantiate improvement trends.'
                    : 'No verified improvements logged yet.'}
                </p>
              )}
            </div>
          </div>

          {/* Overall Trajectory */}
          {aiSynthesis.overallTrajectory && (
            <div className="p-5 rounded-xl border border-[#24242A] bg-[#16161A] text-xs sm:text-sm text-[#E0E0E6]">
              <strong className="font-semibold text-white block mb-1">
                AI Trajectory Verdict:
              </strong>
              {aiSynthesis.overallTrajectory}
            </div>
          )}
        </div>
      )}

      {/* Study Activity Over Time */}
      {hasLogs && (
        <div className="p-6 rounded-xl border border-[#24242A] bg-[#16161A] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E8E9F] flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#666675]" />
              <span>Study Activity History</span>
            </h3>
            <span className="text-xs text-[#666675] font-mono">{logs.length} logged days</span>
          </div>

          <div className="space-y-2">
            {logs.slice(0, 7).map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-lg border border-[#24242A] bg-[#0C0C0E] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[#666675]">{log.date}</span>
                  <span className="font-medium text-white truncate max-w-md">
                    {log.content}
                  </span>
                </div>
                <div className="flex items-center space-x-3 shrink-0 text-[#8E8E9F]">
                  {log.subject && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#16161A] border border-[#2D2D33] text-[#A0A0B0]">
                      {log.subject}
                    </span>
                  )}
                  {log.timeSpentMinutes && (
                    <span className="text-[#8E8E9F] font-mono">{log.timeSpentMinutes}m</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
