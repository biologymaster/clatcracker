import React from 'react';
import { MockTest, DailyLog, AIPriorityReport, ActiveTab, CLAT_SECTIONS, SectionKey } from '../types';
import { 
  FileText, 
  CalendarDays, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Plus,
  RefreshCw,
  Target
} from 'lucide-react';

interface DashboardViewProps {
  mocks: MockTest[];
  logs: DailyLog[];
  priorities: AIPriorityReport | null;
  onNavigate: (tab: ActiveTab) => void;
  onOpenAddMock: () => void;
  onOpenAddLog: () => void;
  onGeneratePriorities: () => void;
  isGeneratingPriorities: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  mocks,
  logs,
  priorities,
  onNavigate,
  onOpenAddMock,
  onOpenAddLog,
  onGeneratePriorities,
  isGeneratingPriorities,
}) => {
  const hasMocks = mocks.length > 0;
  const hasLogs = logs.length > 0;
  const isEmpty = !hasMocks && !hasLogs;

  const latestMock = hasMocks ? mocks[mocks.length - 1] : null;
  const latestLog = hasLogs ? logs[0] : null;

  const totalStudyMinutes = logs.reduce((acc, l) => acc + (l.timeSpentMinutes || 0), 0);

  // If completely empty, show the pristine starter view with Sophisticated Dark styling
  if (isEmpty) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Empty State Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#16161A] border border-[#2D2D33] text-[#6366F1] mb-4 shadow-lg">
            <Target className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif italic tracking-tight text-white">
            Welcome to CLATCracker
          </h1>
          <p className="mt-2 text-sm text-[#8E8E9F] max-w-xl mx-auto font-sans leading-relaxed">
            Your personal, AI-driven CLAT tracker. Starting completely empty — ready for 100% real data from your actual mock tests and daily practice.
          </p>
        </div>

        {/* Feedback Loop Explanation */}
        <div className="bg-[#16161A] border border-[#24242A] rounded-xl p-6 mb-8">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#666675] mb-4 text-center sm:text-left">
            The Core CLAT Preparation Loop
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 text-xs font-medium text-[#E0E0E6]">
            <span className="px-3 py-2 rounded-lg bg-[#0C0C0E] border border-[#2D2D33]">1. Log Mock</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#666675] shrink-0" />
            <span className="px-3 py-2 rounded-lg bg-[#0C0C0E] border border-[#2D2D33]">2. AI Diagnose</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#666675] shrink-0" />
            <span className="px-3 py-2 rounded-lg bg-[#0C0C0E] border border-[#2D2D33]">3. Spot Error Patterns</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#666675] shrink-0" />
            <span className="px-3 py-2 rounded-lg bg-[#0C0C0E] border border-[#2D2D33]">4. Target Weaknesses</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#666675] shrink-0" />
            <span className="px-3 py-2 rounded-lg bg-[#0C0C0E] border border-[#2D2D33]">5. Measure Gain</span>
          </div>
        </div>

        {/* Getting Started Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-xl border border-[#24242A] bg-[#16161A] hover:border-[#6366F1]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#0C0C0E] border border-[#2D2D33] text-[#6366F1] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-base font-serif italic text-white">
                Add Your First Mock Test
              </h2>
              <p className="mt-2 text-xs text-[#8E8E9F] leading-relaxed font-sans">
                Enter your section-wise marks, time spent per section, and natural language mistake log. The AI will extract your exact error patterns (overthinking, misreading, concept gap, timing).
              </p>
            </div>
            <button
              onClick={onOpenAddMock}
              id="empty-add-mock-btn"
              className="mt-6 w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mock Test</span>
            </button>
          </div>

          <div className="p-6 rounded-xl border border-[#24242A] bg-[#16161A] hover:border-[#2D2D33] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#0C0C0E] border border-[#2D2D33] text-[#E0E0E6] flex items-center justify-center mb-4">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h2 className="text-base font-serif italic text-white">
                Log Today's Study Activity
              </h2>
              <p className="mt-2 text-xs text-[#8E8E9F] leading-relaxed font-sans">
                A quick entry of what you actually studied today (e.g., “Did 2 LR passages, revised July GK, 20 Quant questions”). Fast and frictionless.
              </p>
            </div>
            <button
              onClick={onOpenAddLog}
              id="empty-add-log-btn"
              className="mt-6 w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#0C0C0E] border border-[#2D2D33] hover:bg-[#24242A] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Log Study Session</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard with data - Sophisticated Dark
  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#24242A] bg-[#16161A]">
          <span className="text-xs font-medium text-[#8E8E9F]">Latest Mock Score</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-serif italic text-white">
              {latestMock ? latestMock.overallScore : '—'}
            </span>
            {latestMock && (
              <span className="text-xs text-[#8E8E9F] truncate max-w-[110px]" title={latestMock.title}>
                {latestMock.title}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#666675] mt-1.5 block">
            {latestMock ? `${latestMock.totalTimeMinutes}m total time` : 'No mock logged yet'}
          </span>
        </div>

        <div className="p-5 rounded-xl border border-[#24242A] bg-[#16161A]">
          <span className="text-xs font-medium text-[#8E8E9F]">Mocks Analyzed</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-serif italic text-white">
              {mocks.length}
            </span>
            <span className="text-xs font-medium text-[#6366F1]">
              {mocks.filter((m) => m.aiAnalysis).length} with AI deep dive
            </span>
          </div>
          <span className="text-[11px] text-[#666675] mt-1.5 block">
            {mocks.length === 1 ? 'Baseline test logged' : `${mocks.length} tests recorded`}
          </span>
        </div>

        <div className="p-5 rounded-xl border border-[#24242A] bg-[#16161A]">
          <span className="text-xs font-medium text-[#8E8E9F]">Study Sessions Logged</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-serif italic text-white">
              {logs.length}
            </span>
            {totalStudyMinutes > 0 && (
              <span className="text-xs text-[#8E8E9F]">
                {Math.round(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#666675] mt-1.5 block">
            {latestLog ? `Latest: ${latestLog.date}` : 'No daily logs recorded'}
          </span>
        </div>

        <div className="p-5 rounded-xl border border-[#24242A] bg-[#16161A]">
          <span className="text-xs font-medium text-[#8E8E9F]">Top Priority Need</span>
          <div className="mt-2">
            {latestMock?.aiAnalysis?.priorityWeaknesses?.[0] ? (
              <div className="truncate text-sm font-semibold text-rose-400">
                {latestMock.aiAnalysis.priorityWeaknesses[0].area}
              </div>
            ) : (
              <span className="text-sm font-medium text-[#666675]">
                {hasMocks ? 'Run AI Analysis on Mock' : 'Add mock to diagnose'}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#666675] mt-1.5 block truncate">
            {latestMock?.aiAnalysis?.priorityWeaknesses?.[0]?.description || 'Awaiting diagnostic'}
          </span>
        </div>
      </div>

      {/* AI Next Action Card */}
      <div className="rounded-xl border border-[#2D2D33] bg-[#16161A] p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-widest text-[#6366F1] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Priorities Engine</span>
            </div>
            <h2 className="text-lg font-serif italic text-white">
              “Based on my performance & study, what should I do next?”
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#8E8E9F] max-w-2xl font-sans">
              {priorities?.headline
                ? priorities.headline
                : 'CLATCracker detects mismatches between what your mocks say you need to fix and what you are actually studying.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onGeneratePriorities}
              disabled={isGeneratingPriorities}
              id="dashboard-refresh-priorities-btn"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-colors shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPriorities ? 'animate-spin' : ''}`} />
              <span>{isGeneratingPriorities ? 'Analyzing...' : 'Refresh Priorities'}</span>
            </button>
            <button
              onClick={() => onNavigate('priorities')}
              className="inline-flex items-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-[#E0E0E6] bg-[#0C0C0E] border border-[#2D2D33] hover:bg-[#24242A] transition-colors"
            >
              <span>View Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Priority items snippet if present */}
        {priorities && priorities.priorities.length > 0 && (
          <div className="mt-5 pt-5 border-t border-[#24242A] grid grid-cols-1 md:grid-cols-3 gap-3">
            {priorities.priorities.slice(0, 3).map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-3.5 bg-[#0C0C0E] rounded-lg border border-[#24242A]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white">
                    {idx + 1}. {item.subject}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                      item.priority === 'High'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-900/50'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-900/50'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="text-xs text-[#8E8E9F] line-clamp-2">
                  {item.task}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Column Split: Latest Mock vs Recent Study */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Mock Card */}
        <div className="rounded-xl border border-[#24242A] bg-[#16161A] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#8E8E9F]" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8E8E9F]">
                  Latest Mock Analysis
                </h3>
              </div>
              <button
                onClick={() => onNavigate('mocks')}
                className="text-xs font-medium text-[#6366F1] hover:underline"
              >
                All Mocks ({mocks.length})
              </button>
            </div>

            {latestMock ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#24242A]">
                  <div>
                    <h4 className="text-base font-serif italic text-white">
                      {latestMock.title}
                    </h4>
                    <span className="text-xs text-[#666675]">{latestMock.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-serif italic text-white">
                      {latestMock.overallScore}
                    </span>
                    <span className="text-xs text-[#666675] block">{latestMock.totalTimeMinutes} mins</span>
                  </div>
                </div>

                {/* Section marks pills */}
                <div className="grid grid-cols-5 gap-2 text-center">
                  {(Object.keys(CLAT_SECTIONS) as SectionKey[]).map((k) => {
                    const sec = latestMock.sections[k] || { marks: 0, timeMinutes: 0 };
                    return (
                      <div key={k} className="p-2.5 rounded-lg bg-[#0C0C0E] border border-[#24242A]">
                        <span className="text-[10px] font-bold text-[#666675] uppercase block">
                          {CLAT_SECTIONS[k].shortLabel}
                        </span>
                        <span className="text-xs font-bold text-white mt-1 block font-mono">
                          {sec.marks}
                        </span>
                        <span className="text-[10px] text-[#8E8E9F] block font-mono">
                          {sec.timeMinutes}m
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Mistake Log Preview */}
                {latestMock.mistakeLog && (
                  <div className="p-3 rounded-lg bg-[#0C0C0E] text-xs text-[#8E8E9F] italic border-l-2 border-amber-500/70">
                    "{latestMock.mistakeLog.slice(0, 180)}..."
                  </div>
                )}

                {/* AI Findings Preview if analyzed */}
                {latestMock.aiAnalysis ? (
                  <div className="space-y-2 text-xs pt-1">
                    {latestMock.aiAnalysis.whatWentWell.length > 0 && (
                      <div className="flex items-start space-x-2 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span><strong className="text-emerald-300">Went well:</strong> {latestMock.aiAnalysis.whatWentWell[0]}</span>
                      </div>
                    )}
                    {latestMock.aiAnalysis.biggestProblems.length > 0 && (
                      <div className="flex items-start space-x-2 text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span><strong className="text-rose-300">Problem:</strong> {latestMock.aiAnalysis.biggestProblems[0]}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-[#666675] italic pt-1">
                    AI analysis has not been run for this mock yet.
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#666675]">
                No mock tests recorded yet.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#24242A] flex items-center justify-between">
            <button
              onClick={onOpenAddMock}
              id="dashboard-add-mock-link"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#8E8E9F] hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Mock</span>
            </button>
            {latestMock && (
              <button
                onClick={() => onNavigate('mocks')}
                className="inline-flex items-center space-x-1 text-xs font-medium text-[#6366F1] hover:underline"
              >
                <span>Full Mock Breakdown</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Daily Study Log Snapshot */}
        <div className="rounded-xl border border-[#24242A] bg-[#16161A] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-[#8E8E9F]" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8E8E9F]">
                  Recent Daily Study
                </h3>
              </div>
              <button
                onClick={() => onNavigate('dailylog')}
                className="text-xs font-medium text-[#6366F1] hover:underline"
              >
                All Logs ({logs.length})
              </button>
            </div>

            {hasLogs ? (
              <div className="space-y-3">
                {logs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-lg border border-[#24242A] bg-[#0C0C0E]"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#666675] mb-1 font-mono">
                      <span>{log.date}</span>
                      {log.timeSpentMinutes && (
                        <span className="flex items-center space-x-1 text-[#8E8E9F]">
                          <Clock className="w-3 h-3" />
                          <span>{log.timeSpentMinutes}m</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-[#E0E0E6]">
                      {log.content}
                    </p>
                    {log.subject && (
                      <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold rounded bg-[#16161A] border border-[#2D2D33] text-[#8E8E9F]">
                        {log.subject}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#666675]">
                No study logs recorded yet. Use the quick logger to track daily passages & questions.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#24242A] flex items-center justify-between">
            <button
              onClick={onOpenAddLog}
              id="dashboard-add-log-link"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#8E8E9F] hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Today's Study</span>
            </button>
            {hasLogs && (
              <button
                onClick={() => onNavigate('dailylog')}
                className="inline-flex items-center space-x-1 text-xs font-medium text-[#6366F1] hover:underline"
              >
                <span>View Study Activity</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
