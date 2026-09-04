import React, { useState } from 'react';
import { AIPriorityReport, MockTest, DailyLog } from '../types';
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Circle, 
  Info, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Clock
} from 'lucide-react';

interface AIPrioritiesViewProps {
  priorities: AIPriorityReport | null;
  mocks: MockTest[];
  logs: DailyLog[];
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  onOpenAddMock: () => void;
  onOpenAddLog: () => void;
}

export const AIPrioritiesView: React.FC<AIPrioritiesViewProps> = ({
  priorities,
  mocks,
  logs,
  onGenerate,
  isGenerating,
  onOpenAddMock,
  onOpenAddLog,
}) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleComplete = (id: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hasData = mocks.length > 0 || logs.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24242A] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-widest text-[#6366F1] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Core Synthesis Engine</span>
          </div>
          <h1 className="text-2xl font-serif italic text-white tracking-tight">
            AI Study Priorities
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E9F] mt-1 font-sans">
            Answers: “Based on my performance and what I've actually been studying, what should I do next?”
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          id="refresh-ai-priorities-btn"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Analyzing Performance...' : priorities ? 'Re-calculate Priorities' : 'Generate Priorities'}</span>
        </button>
      </div>

      {/* Zero Data State */}
      {!hasData && (
        <div className="p-8 rounded-2xl border border-dashed border-[#24242A] bg-[#16161A]/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#0C0C0E] border border-[#2D2D33] text-amber-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif italic text-white">
            No Performance Data Recorded
          </h3>
          <p className="text-xs sm:text-sm text-[#8E8E9F] max-w-md mx-auto font-sans leading-relaxed">
            CLATCracker operates with 100% strict data fidelity. It will not hallucinate fake schedules without real mock scores or study logs.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={onOpenAddMock}
              className="px-4 py-2 text-xs font-medium rounded-lg text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs"
            >
              + Add Mock Test
            </button>
            <button
              onClick={onOpenAddLog}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2D2D33] bg-[#16161A] text-white hover:bg-[#24242A]"
            >
              + Log Today's Study
            </button>
          </div>
        </div>
      )}

      {/* Has data but priorities not yet generated */}
      {hasData && !priorities && !isGenerating && (
        <div className="p-8 rounded-2xl border border-[#24242A] bg-[#16161A] text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#0C0C0E] border border-[#2D2D33] text-[#6366F1] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif italic text-white">
            Ready to Synthesize Your Priorities
          </h3>
          <p className="text-xs sm:text-sm text-[#8E8E9F] max-w-md mx-auto font-sans leading-relaxed">
            You have {mocks.length} mock test{mocks.length === 1 ? '' : 's'} and {logs.length} study session{logs.length === 1 ? '' : 's'} logged. Click below to analyze your mistake patterns and identify what to focus on next.
          </p>
          <button
            onClick={onGenerate}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Priorities Now</span>
          </button>
        </div>
      )}

      {/* Render generated priority report */}
      {priorities && (
        <div className="space-y-6">
          {/* Data Sufficiency Notice if applicable */}
          {priorities.dataSufficiencyNotice && (
            <div className="p-4 bg-[#16161A] border border-[#2D2D33] rounded-xl flex items-start space-x-3 text-xs text-[#8E8E9F]">
              <Info className="w-4 h-4 mt-0.5 text-[#6366F1] shrink-0" />
              <div>
                <strong className="font-semibold block text-white">Data Assessment:</strong>
                <span>{priorities.dataSufficiencyNotice}</span>
              </div>
            </div>
          )}

          {/* Headline Banner */}
          <div className="p-6 rounded-xl border border-[#2D2D33] bg-[#16161A] shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6366F1]">
              Current Focus Diagnostic
            </span>
            <h2 className="text-lg sm:text-xl font-serif italic text-white mt-1.5 leading-snug">
              {priorities.headline}
            </h2>
            <p className="text-[11px] text-[#666675] mt-2.5 flex items-center space-x-1.5 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>Calculated from {mocks.length} mock test{mocks.length === 1 ? '' : 's'} and {logs.length} study log{logs.length === 1 ? '' : 's'}.</span>
            </p>
          </div>

          {/* MISMATCH DETECTOR */}
          {priorities.mismatches && priorities.mismatches.length > 0 && (
            <div className="p-5 rounded-xl border border-amber-900/40 bg-[#16161A] space-y-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">
                  Mismatch Detected (Weakness Needs vs. Actual Study)
                </h3>
              </div>
              <div className="space-y-2.5">
                {priorities.mismatches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#0C0C0E] rounded-lg border border-[#24242A] text-xs text-[#8E8E9F] space-y-2"
                  >
                    <p className="font-semibold text-white">
                      {m.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-[#24242A]">
                      <div>
                        <span className="text-rose-400 font-bold">Identified Need: </span>
                        <span>{m.identifiedNeed}</span>
                      </div>
                      <div>
                        <span className="text-amber-400 font-bold">Recent Study: </span>
                        <span>{m.recentStudyTrend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TODAY'S PRIORITIES */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E8E9F] flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#6366F1]" />
                <span>TODAY'S ACTION LIST</span>
              </h3>
              <span className="text-xs text-[#666675] font-mono">
                {Object.values(completedItems).filter(Boolean).length} of {priorities.priorities.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {priorities.priorities.map((item, idx) => {
                const isCompleted = Boolean(completedItems[item.id || idx]);
                return (
                  <div
                    key={item.id || idx}
                    onClick={() => toggleComplete(item.id || String(idx))}
                    className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex items-start space-x-4 ${
                      isCompleted
                        ? 'border-emerald-900/40 bg-[#0C0C0E] opacity-60'
                        : 'border-[#24242A] bg-[#16161A] hover:border-[#2D2D33] shadow-xs'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-[#666675] hover:text-white shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#2D2D33]" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {idx + 1}. {item.subject}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            item.priority === 'High'
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-900/40'
                              : item.priority === 'Medium'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-900/40'
                              : 'bg-[#0C0C0E] text-[#8E8E9F] border border-[#2D2D33]'
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>

                      <p
                        className={`text-sm font-semibold text-white ${
                          isCompleted ? 'line-through text-[#666675]' : ''
                        }`}
                      >
                        {item.task}
                      </p>

                      <p className="text-xs text-[#8E8E9F] leading-relaxed pt-1">
                        <strong className="text-white">Why: </strong>
                        {item.rationale}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tactical Advice */}
          {priorities.tacticalAdvice && (
            <div className="p-4 rounded-xl border border-[#24242A] bg-[#16161A] flex items-start space-x-3 text-xs text-[#8E8E9F]">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#6366F1] shrink-0" />
              <div>
                <strong className="font-semibold text-white block mb-0.5">
                  Tactical Rule for Today:
                </strong>
                <span>{priorities.tacticalAdvice}</span>
              </div>
            </div>
          )}

          {/* Quick Study logger shortcut */}
          <div className="pt-4 flex items-center justify-between border-t border-[#24242A]">
            <span className="text-xs text-[#666675]">Done with these tasks?</span>
            <button
              onClick={onOpenAddLog}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white bg-[#16161A] border border-[#2D2D33] hover:bg-[#24242A] transition-colors"
            >
              <span>Log Study Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
