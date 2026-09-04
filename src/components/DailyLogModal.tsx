import React, { useState, useEffect } from 'react';
import { DailyLog } from '../types';
import { X, Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: DailyLog) => void;
  initialLog?: DailyLog | null;
}

const COMMON_TAGS = ['Logical Reasoning', 'Legal Reasoning', 'Current Affairs & GK', 'English', 'Quant', 'Mock Analysis'];

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLog,
}) => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [timeSpentMinutes, setTimeSpentMinutes] = useState<number | ''>('');
  const [questionsOrPassages, setQuestionsOrPassages] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLog) {
      setDate(initialLog.date);
      setContent(initialLog.content);
      setSelectedSubject(initialLog.subject || '');
      setTimeSpentMinutes(initialLog.timeSpentMinutes ?? '');
      setQuestionsOrPassages(initialLog.questionsOrPassages || '');
      setNotes(initialLog.notes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setContent('');
      setSelectedSubject('');
      setTimeSpentMinutes('');
      setQuestionsOrPassages('');
      setNotes('');
    }
    setError(null);
  }, [initialLog, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please provide a brief note of what you studied today.');
      return;
    }

    const log: DailyLog = {
      id: initialLog ? initialLog.id : `log_${Date.now()}`,
      date,
      content: content.trim(),
      subject: selectedSubject.trim() || undefined,
      timeSpentMinutes: timeSpentMinutes !== '' ? Number(timeSpentMinutes) : undefined,
      questionsOrPassages: questionsOrPassages.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: initialLog ? initialLog.createdAt : Date.now(),
    };

    onSave(log);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0C0C0E]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#16161A] rounded-2xl shadow-2xl max-w-lg w-full border border-[#24242A] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#24242A] flex items-center justify-between bg-[#16161A]">
          <div>
            <h2 className="text-lg font-serif italic text-white">
              {initialLog ? 'Edit Daily Study Log' : "Log Today's Study"}
            </h2>
            <p className="text-xs text-[#8E8E9F] mt-0.5 font-sans">
              Quick and simple — record what you actually accomplished.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E8E9F] hover:text-white p-1 rounded-md transition-colors"
            id="daily-log-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[#0C0C0E] border border-rose-900/40 rounded-xl flex items-start space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F] mb-1.5 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              id="log-date-input"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#24242A] bg-[#0C0C0E] text-white focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F] mb-1.5">
              What did you study? *
            </label>
            <textarea
              rows={3}
              id="log-content-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g., Did 2 LR passages, revised July GK, 20 Quant questions and analysed Mock 5."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#24242A] bg-[#0C0C0E] text-white focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none placeholder:text-[#666675]"
              required
            />
          </div>

          {/* Optional fast tags */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#666675] mb-1.5">
              Quick Subject Tag (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TAGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedSubject(selectedSubject === tag ? '' : tag)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedSubject === tag
                      ? 'bg-[#6366F1] text-white shadow-xs'
                      : 'bg-[#0C0C0E] border border-[#24242A] text-[#8E8E9F] hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Details */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F] mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#666675]" />
                <span>Time Spent (Mins)</span>
              </label>
              <input
                type="number"
                min="1"
                step="5"
                value={timeSpentMinutes}
                onChange={(e) => setTimeSpentMinutes(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="e.g., 90"
                id="log-time-input"
                className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-[#24242A] bg-[#0C0C0E] text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F] mb-1 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-[#666675]" />
                <span>Passages / Qs</span>
              </label>
              <input
                type="text"
                value={questionsOrPassages}
                onChange={(e) => setQuestionsOrPassages(e.target.value)}
                placeholder="e.g., 2 passages, 20 Qs"
                id="log-questions-input"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-[#24242A] bg-[#0C0C0E] text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          {/* Optional Takeaway Notes */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F] mb-1">
              Reflections / Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Found assumption questions easier with negation technique."
              id="log-notes-input"
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-[#24242A] bg-[#0C0C0E] text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#24242A] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#8E8E9F] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="daily-log-save-btn"
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs transition-colors"
            >
              Save Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
