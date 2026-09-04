import React, { useState } from 'react';
import { DailyLog } from '../types';
import { CalendarDays, Plus, Clock, BookOpen, Trash2, Edit3, Filter } from 'lucide-react';

interface DailyLogViewProps {
  logs: DailyLog[];
  onOpenAddLog: () => void;
  onEditLog: (log: DailyLog) => void;
  onDeleteLog: (id: string) => void;
}

export const DailyLogView: React.FC<DailyLogViewProps> = ({
  logs,
  onOpenAddLog,
  onEditLog,
  onDeleteLog,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const totalMinutes = logs.reduce((acc, l) => acc + (l.timeSpentMinutes || 0), 0);

  // Extract unique subjects
  const allSubjects = Array.from(
    new Set(logs.map((l) => l.subject).filter((s): s is string => Boolean(s)))
  );

  const filteredLogs = selectedTag === 'all'
    ? logs
    : logs.filter((l) => l.subject === selectedTag);

  if (logs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-[#24242A] bg-[#16161A]/40">
          <div className="w-12 h-12 rounded-xl bg-[#0C0C0E] border border-[#2D2D33] text-[#E0E0E6] flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif italic text-white">
            No Study Activity Logged Yet
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#8E8E9F] max-w-md mx-auto leading-relaxed font-sans">
            Keep it quick: simply record what you actually did today (e.g. “Did 2 LR passages, revised July GK, 20 Quant questions”). No hourly timetable needed.
          </p>
          <button
            onClick={onOpenAddLog}
            id="empty-view-add-log-btn"
            className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Today's Study</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-serif italic text-white tracking-tight">
            Daily Study Activity Log
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E9F] mt-1 font-sans">
            {logs.length} sessions logged
            {totalMinutes > 0 && ` • Total time: ${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m`}
          </p>
        </div>
        <button
          onClick={onOpenAddLog}
          id="daily-log-view-add-btn"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Today's Study</span>
        </button>
      </div>

      {/* Filter by subject pills */}
      {allSubjects.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-[#666675] uppercase tracking-widest flex items-center space-x-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              selectedTag === 'all'
                ? 'bg-[#16161A] text-white border border-[#2D2D33] shadow-xs'
                : 'bg-[#0C0C0E] text-[#8E8E9F] border border-[#24242A] hover:text-white'
            }`}
          >
            All ({logs.length})
          </button>
          {allSubjects.map((sub) => {
            const count = logs.filter((l) => l.subject === sub).length;
            return (
              <button
                key={sub}
                onClick={() => setSelectedTag(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  selectedTag === sub
                    ? 'bg-[#16161A] text-white border border-[#2D2D33] shadow-xs'
                    : 'bg-[#0C0C0E] text-[#8E8E9F] border border-[#24242A] hover:text-white'
                }`}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Log Feed */}
      <div className="space-y-3.5">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-5 rounded-xl border border-[#24242A] bg-[#16161A] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-semibold text-white font-mono">
                  {log.date}
                </span>
                {log.subject && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#0C0C0E] border border-[#2D2D33] text-[#A0A0B0]">
                    {log.subject}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs text-[#666675]">
                {log.timeSpentMinutes && (
                  <span className="flex items-center space-x-1 text-[#8E8E9F] font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#666675]" />
                    <span>{log.timeSpentMinutes} mins</span>
                  </span>
                )}
                {log.questionsOrPassages && (
                  <span className="flex items-center space-x-1 text-[#8E8E9F]">
                    <BookOpen className="w-3.5 h-3.5 text-[#666675]" />
                    <span>{log.questionsOrPassages}</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-[#E0E0E6] leading-relaxed font-sans">
              {log.content}
            </p>

            {log.notes && (
              <div className="text-xs text-[#8E8E9F] bg-[#0C0C0E] p-3 rounded-lg border-l-2 border-[#6366F1]">
                <strong className="text-[#E0E0E6]">Reflection:</strong> {log.notes}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2 text-xs text-[#666675] border-t border-[#24242A]">
              <button
                onClick={() => onEditLog(log)}
                className="inline-flex items-center space-x-1 text-[#8E8E9F] hover:text-white transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this daily log entry?')) {
                    onDeleteLog(log.id);
                  }
                }}
                className="inline-flex items-center space-x-1 text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
