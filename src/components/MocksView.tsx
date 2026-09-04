import React, { useState } from 'react';
import { MockTest, CLAT_SECTIONS, SectionKey } from '../types';
import { 
  FileText, 
  Plus, 
  Sparkles, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Repeat, 
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MocksViewProps {
  mocks: MockTest[];
  onOpenAddMock: () => void;
  onEditMock: (mock: MockTest) => void;
  onDeleteMock: (id: string) => void;
  onAnalyzeMock: (mock: MockTest) => Promise<void>;
  analyzingMockId: string | null;
}

export const MocksView: React.FC<MocksViewProps> = ({
  mocks,
  onOpenAddMock,
  onEditMock,
  onDeleteMock,
  onAnalyzeMock,
  analyzingMockId,
}) => {
  const [expandedMockId, setExpandedMockId] = useState<string | null>(() => {
    return mocks.length > 0 ? mocks[mocks.length - 1].id : null;
  });

  const toggleExpand = (id: string) => {
    setExpandedMockId(expandedMockId === id ? null : id);
  };

  if (mocks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-[#24242A] bg-[#16161A]/40">
          <div className="w-12 h-12 rounded-xl bg-[#0C0C0E] border border-[#2D2D33] text-[#6366F1] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif italic text-white">
            No Mock Tests Added Yet
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#8E8E9F] max-w-md mx-auto leading-relaxed font-sans">
            Add your actual mock test results with section marks, timings, and a natural language mistake log to generate targeted AI diagnostics.
          </p>
          <button
            onClick={onOpenAddMock}
            id="empty-view-add-mock-btn"
            className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Mock</span>
          </button>
        </div>
      </div>
    );
  }

  // Reverse list so newest is at the top
  const sortedMocks = [...mocks].reverse();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-serif italic text-white tracking-tight">
            Mock Tests & Mistake Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E9F] mt-1 font-sans">
            Compare performance across tests and detect whether weaknesses are repeating, improving, or worsening.
          </p>
        </div>
        <button
          onClick={onOpenAddMock}
          id="mocks-view-add-mock-btn"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Mock Test</span>
        </button>
      </div>

      {/* Mocks List */}
      <div className="space-y-4">
        {sortedMocks.map((mock, index) => {
          const isExpanded = expandedMockId === mock.id;
          const isAnalyzing = analyzingMockId === mock.id;
          const mockNumber = sortedMocks.length - index;

          return (
            <div
              key={mock.id}
              className="rounded-xl border border-[#24242A] bg-[#16161A] shadow-xs overflow-hidden transition-all"
            >
              {/* Card Header Bar */}
              <div
                onClick={() => toggleExpand(mock.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#1E1E24] transition-colors"
              >
                <div className="flex items-start sm:items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0C0C0E] border border-[#2D2D33] text-white flex items-center justify-center font-serif italic text-xs shrink-0">
                    #{mockNumber}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-base font-serif italic text-white">
                        {mock.title}
                      </h3>
                      {mock.aiAnalysis ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#16161A] text-emerald-400 border border-emerald-900/40">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>AI Analyzed</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#0C0C0E] text-[#8E8E9F] border border-[#2D2D33]">
                          Pending AI
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#666675] mt-0.5 block">{mock.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-6">
                  <div className="text-right">
                    <span className="text-xl font-bold font-serif italic text-white block">
                      {mock.overallScore}
                    </span>
                    <span className="text-xs text-[#666675] block font-mono">
                      {mock.totalTimeMinutes} mins
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-[#8E8E9F]">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Collapsed Section summary pills */}
              {!isExpanded && (
                <div className="px-5 pb-4 pt-3 grid grid-cols-5 gap-2 border-t border-[#24242A]">
                  {(Object.keys(CLAT_SECTIONS) as SectionKey[]).map((k) => {
                    const sec = mock.sections[k] || { marks: 0, timeMinutes: 0 };
                    return (
                      <div key={k} className="text-center p-2 rounded-lg bg-[#0C0C0E] border border-[#24242A]">
                        <span className="text-[10px] text-[#666675] font-bold block uppercase">
                          {CLAT_SECTIONS[k].shortLabel}
                        </span>
                        <span className="text-xs font-bold font-mono text-white mt-0.5 block">
                          {sec.marks}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Expanded Details Body */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-[#24242A] bg-[#0C0C0E] space-y-6">
                  {/* Detailed Section Grid */}
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F] mb-3">
                      Section-Wise Breakdown
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {(Object.keys(CLAT_SECTIONS) as SectionKey[]).map((key) => {
                        const s = mock.sections[key] || { marks: 0, timeMinutes: 0 };
                        const meta = CLAT_SECTIONS[key];
                        return (
                          <div
                            key={key}
                            className="p-3 rounded-lg border border-[#24242A] bg-[#16161A]"
                          >
                            <span className="text-xs font-semibold text-[#8E8E9F] block truncate">
                              {meta.shortLabel}
                            </span>
                            <div className="mt-1 flex items-baseline justify-between">
                              <span className="text-base font-bold font-mono text-white">
                                {s.marks}
                              </span>
                              <span className="text-xs text-[#666675] font-mono">{s.timeMinutes}m</span>
                            </div>
                            {(s.attempted !== undefined || s.wrong !== undefined) && (
                              <div className="mt-2 text-[10px] text-[#666675] border-t border-[#24242A] pt-1.5 flex justify-between font-mono">
                                <span>Att: {s.attempted ?? '—'}</span>
                                <span className="text-rose-400">W: {s.wrong ?? '—'}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mistake Log Natural Text */}
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F] mb-2">
                      Natural Mistake Log
                    </h4>
                    <div className="p-4 rounded-lg border border-[#24242A] bg-[#16161A] text-xs sm:text-sm text-[#E0E0E6] leading-relaxed font-mono">
                      {mock.mistakeLog || '(No detailed mistake log entered for this test)'}
                    </div>
                  </div>

                  {/* AI Analysis Panel */}
                  {mock.aiAnalysis ? (
                    <div className="rounded-xl border border-[#2D2D33] bg-[#16161A] p-5 space-y-5">
                      <div className="flex items-center justify-between border-b border-[#24242A] pb-3">
                        <div className="flex items-center space-x-2 text-[#6366F1] font-bold text-sm">
                          <Sparkles className="w-4 h-4" />
                          <span className="font-serif italic text-white text-base">AI Diagnostic Report</span>
                        </div>
                        <span className="text-[10px] text-[#666675] font-mono">
                          {new Date(mock.aiAnalysis.analyzedAt).toLocaleString()}
                        </span>
                      </div>

                      {/* 1. What went well & 2. Biggest problems */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* What went well */}
                        <div className="p-4 rounded-lg bg-[#0C0C0E] border border-emerald-900/30">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center space-x-1.5 mb-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>What Went Well</span>
                          </h5>
                          <ul className="space-y-1.5 text-xs text-emerald-200/90">
                            {mock.aiAnalysis.whatWentWell.map((item, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="text-emerald-400">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Biggest problems */}
                        <div className="p-4 rounded-lg bg-[#0C0C0E] border border-rose-900/30">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center space-x-1.5 mb-2.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Biggest Problems</span>
                          </h5>
                          <ul className="space-y-1.5 text-xs text-rose-200/90">
                            {mock.aiAnalysis.biggestProblems.map((item, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="text-rose-400">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 3. Recurring Patterns & 4. Time Problems */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Recurring patterns */}
                        <div className="p-4 rounded-lg bg-[#0C0C0E] border border-[#24242A]">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#E0E0E6] flex items-center space-x-1.5 mb-2.5">
                            <Repeat className="w-3.5 h-3.5 text-amber-400" />
                            <span>Recurring Patterns</span>
                          </h5>
                          <ul className="space-y-1.5 text-xs text-[#8E8E9F]">
                            {mock.aiAnalysis.recurringPatterns.map((item, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="text-amber-400">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Time problems */}
                        <div className="p-4 rounded-lg bg-[#0C0C0E] border border-[#24242A]">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#E0E0E6] flex items-center space-x-1.5 mb-2.5">
                            <Clock className="w-3.5 h-3.5 text-[#6366F1]" />
                            <span>Time & Pacing Problems</span>
                          </h5>
                          <ul className="space-y-1.5 text-xs text-[#8E8E9F]">
                            {mock.aiAnalysis.timeProblems.map((item, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="text-[#6366F1]">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 5. Priority Weaknesses */}
                      {mock.aiAnalysis.priorityWeaknesses.length > 0 && (
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E9F] mb-2.5 flex items-center space-x-1.5">
                            <Flame className="w-3.5 h-3.5 text-rose-400" />
                            <span>Priority Weaknesses</span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {mock.aiAnalysis.priorityWeaknesses.map((w, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-lg border border-[#24242A] bg-[#0C0C0E]"
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs font-bold text-white">
                                    {w.area}
                                  </span>
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                      w.severity === 'high'
                                        ? 'bg-rose-950/60 text-rose-300 border border-rose-900/40'
                                        : w.severity === 'medium'
                                        ? 'bg-amber-950/60 text-amber-300 border border-amber-900/40'
                                        : 'bg-[#16161A] text-[#8E8E9F] border border-[#2D2D33]'
                                    }`}
                                  >
                                    {w.severity}
                                  </span>
                                </div>
                                <p className="text-xs text-[#8E8E9F] leading-relaxed">
                                  {w.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comparison With Previous Mocks (Repeating, Improving, Worsening) */}
                      {mock.aiAnalysis.comparisonsWithPrevious && mock.aiAnalysis.comparisonsWithPrevious.length > 0 && (
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E9F] mb-2.5 flex items-center space-x-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-[#6366F1]" />
                            <span>Comparison With Previous Mocks</span>
                          </h5>
                          <div className="space-y-2">
                            {mock.aiAnalysis.comparisonsWithPrevious.map((comp, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-lg border border-[#24242A] bg-[#0C0C0E] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                              >
                                <div className="flex items-center space-x-2.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                      comp.status === 'improving'
                                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                        : comp.status === 'worsening'
                                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                                        : comp.status === 'repeating'
                                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                                        : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/40'
                                    }`}
                                  >
                                    {comp.status}
                                  </span>
                                  <strong className="text-white">
                                    {comp.weakness}
                                  </strong>
                                </div>
                                <span className="text-[#8E8E9F] text-xs">
                                  {comp.note}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 6. Specific Things to Practise */}
                      <div className="p-4 rounded-lg bg-[#0C0C0E] border border-[#2D2D33]">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#6366F1] mb-2.5">
                          Specific Things to Practise
                        </h5>
                        <ul className="space-y-2 text-xs text-[#E0E0E6]">
                          {mock.aiAnalysis.specificThingsToPractise.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-2.5">
                              <span className="font-bold text-[#6366F1] font-mono">
                                {idx + 1}.
                              </span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Summary */}
                      {mock.aiAnalysis.summary && (
                        <div className="text-xs text-[#8E8E9F] italic pt-1 border-t border-[#24242A]">
                          Diagnostic Summary: {mock.aiAnalysis.summary}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl border border-dashed border-[#24242A] bg-[#16161A] text-center space-y-3">
                      <p className="text-xs text-[#8E8E9F]">
                        AI analysis has not been generated for this mock yet.
                      </p>
                      <button
                        onClick={() => onAnalyzeMock(mock)}
                        disabled={isAnalyzing}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-colors shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isAnalyzing ? 'Analyzing with Gemini...' : 'Run AI Analysis'}</span>
                      </button>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#24242A] text-xs">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onEditMock(mock)}
                        className="inline-flex items-center space-x-1.5 text-[#8E8E9F] hover:text-white transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Mock</span>
                      </button>
                      {mock.aiAnalysis && (
                        <button
                          onClick={() => onAnalyzeMock(mock)}
                          disabled={isAnalyzing}
                          className="inline-flex items-center space-x-1.5 text-[#6366F1] hover:underline"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isAnalyzing ? 'Re-analyzing...' : 'Re-run Analysis'}</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${mock.title}"?`)) {
                          onDeleteMock(mock.id);
                        }
                      }}
                      className="inline-flex items-center space-x-1.5 text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
