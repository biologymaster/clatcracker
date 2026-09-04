import React, { useState, useEffect } from 'react';
import { MockTest, CLAT_SECTIONS, SectionKey, SectionScore } from '../types';
import { X, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface MockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mock: MockTest, triggerAiAnalysis: boolean) => Promise<void>;
  initialMock?: MockTest | null;
  isAnalyzing?: boolean;
}

const defaultSections: Record<SectionKey, SectionScore> = {
  english: { marks: 0, timeMinutes: 0, attempted: undefined, wrong: undefined, skipped: undefined },
  gk: { marks: 0, timeMinutes: 0, attempted: undefined, wrong: undefined, skipped: undefined },
  legal: { marks: 0, timeMinutes: 0, attempted: undefined, wrong: undefined, skipped: undefined },
  logical: { marks: 0, timeMinutes: 0, attempted: undefined, wrong: undefined, skipped: undefined },
  quant: { marks: 0, timeMinutes: 0, attempted: undefined, wrong: undefined, skipped: undefined },
};

export const MockModal: React.FC<MockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMock,
  isAnalyzing = false,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [sections, setSections] = useState<Record<SectionKey, SectionScore>>(defaultSections);
  const [mistakeLog, setMistakeLog] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMock) {
      setTitle(initialMock.title);
      setDate(initialMock.date);
      setSections(initialMock.sections || defaultSections);
      setMistakeLog(initialMock.mistakeLog || '');
    } else {
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setSections({
        english: { marks: 0, timeMinutes: 0 },
        gk: { marks: 0, timeMinutes: 0 },
        legal: { marks: 0, timeMinutes: 0 },
        logical: { marks: 0, timeMinutes: 0 },
        quant: { marks: 0, timeMinutes: 0 },
      });
      setMistakeLog('');
    }
    setError(null);
  }, [initialMock, isOpen]);

  if (!isOpen) return null;

  // Calculate overall marks and time dynamically
  const calculatedTotalMarks: number = (Object.values(sections) as SectionScore[]).reduce<number>(
    (acc, s) => acc + (Number(s.marks) || 0),
    0
  );
  const calculatedTotalTime: number = (Object.values(sections) as SectionScore[]).reduce<number>(
    (acc, s) => acc + (Number(s.timeMinutes) || 0),
    0
  );

  const handleSectionChange = (key: SectionKey, field: keyof SectionScore, value: string) => {
    const num = value === '' ? (field === 'marks' || field === 'timeMinutes' ? 0 : undefined) : parseFloat(value);
    setSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: num,
      },
    }));
  };

  const handleSubmit = async (triggerAi: boolean) => {
    if (!title.trim()) {
      setError('Please provide a mock title or name (e.g., Mock 1, LegalEdge 05).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const newMock: MockTest = {
      id: initialMock ? initialMock.id : `mock_${Date.now()}`,
      title: title.trim(),
      date,
      overallScore: Number(calculatedTotalMarks.toFixed(2)),
      totalTimeMinutes: Math.round(calculatedTotalTime),
      sections,
      mistakeLog: mistakeLog.trim(),
      createdAt: initialMock ? initialMock.createdAt : Date.now(),
      aiAnalysis: initialMock?.aiAnalysis,
    };

    try {
      await onSave(newMock, triggerAi);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save mock test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0C0C0E]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#16161A] rounded-2xl shadow-2xl max-w-3xl w-full border border-[#24242A] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#24242A] flex items-center justify-between bg-[#16161A]">
          <div>
            <h2 className="text-lg font-serif italic text-white">
              {initialMock ? 'Edit Mock Test' : 'Add New Mock Test'}
            </h2>
            <p className="text-xs text-[#8E8E9F] mt-0.5 font-sans">
              Enter real marks, section timings, and your natural mistake log.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E8E9F] hover:text-white p-1 rounded-md transition-colors"
            id="mock-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 bg-[#0C0C0E] border border-rose-900/40 rounded-xl flex items-start space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F] mb-1.5">
                Mock Name / Source *
              </label>
              <input
                type="text"
                id="mock-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Mock 1, LegalEdge 05, Career Launcher Prime 02"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#24242A] bg-[#0C0C0E] text-white focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none placeholder:text-[#666675]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F] mb-1.5">
                Date Taken *
              </label>
              <input
                type="date"
                id="mock-date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#24242A] bg-[#0C0C0E] text-white focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Section-wise breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F]">
                Section-wise Marks & Time Taken
              </label>
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="text-xs text-[#6366F1] hover:underline flex items-center space-x-1"
                id="toggle-optional-fields-btn"
              >
                <span>{showOptionalFields ? 'Hide question counts' : 'Show attempted / wrong / skipped'}</span>
                {showOptionalFields ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="border border-[#24242A] rounded-xl overflow-hidden divide-y divide-[#24242A]">
              {(Object.keys(CLAT_SECTIONS) as SectionKey[]).map((key) => {
                const sectionMeta = CLAT_SECTIONS[key];
                const data = sections[key] || { marks: 0, timeMinutes: 0 };
                return (
                  <div key={key} className="p-3.5 sm:px-4 bg-[#0C0C0E] hover:bg-[#121215] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="w-48 shrink-0">
                        <span className="text-sm font-medium text-white">
                          {sectionMeta.label}
                        </span>
                        <span className="block text-[10px] text-[#666675]">
                          CLAT standard ~{sectionMeta.defaultQuestions} Qs
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center space-x-1.5">
                          <label className="text-xs text-[#8E8E9F]">Marks:</label>
                          <input
                            type="number"
                            step="0.25"
                            value={data.marks || ''}
                            onChange={(e) => handleSectionChange(key, 'marks', e.target.value)}
                            placeholder="0"
                            id={`mock-marks-${key}`}
                            className="w-20 px-2.5 py-1 text-sm font-mono rounded-lg border border-[#24242A] bg-[#16161A] text-white text-right focus:outline-none focus:border-[#6366F1]"
                          />
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <label className="text-xs text-[#8E8E9F]">Time (mins):</label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={data.timeMinutes || ''}
                            onChange={(e) => handleSectionChange(key, 'timeMinutes', e.target.value)}
                            placeholder="0"
                            id={`mock-time-${key}`}
                            className="w-20 px-2.5 py-1 text-sm font-mono rounded-lg border border-[#24242A] bg-[#16161A] text-white text-right focus:outline-none focus:border-[#6366F1]"
                          />
                        </div>
                      </div>
                    </div>

                    {showOptionalFields && (
                      <div className="mt-2.5 pt-2 border-t border-[#24242A] flex items-center space-x-4 pl-0 sm:pl-48 text-xs font-mono">
                        <div className="flex items-center space-x-1">
                          <span className="text-[#666675]">Att:</span>
                          <input
                            type="number"
                            value={data.attempted ?? ''}
                            onChange={(e) => handleSectionChange(key, 'attempted', e.target.value)}
                            placeholder="-"
                            className="w-14 px-1.5 py-0.5 rounded border border-[#24242A] bg-[#16161A] text-white text-right"
                          />
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-rose-400">Wrong:</span>
                          <input
                            type="number"
                            value={data.wrong ?? ''}
                            onChange={(e) => handleSectionChange(key, 'wrong', e.target.value)}
                            placeholder="-"
                            className="w-14 px-1.5 py-0.5 rounded border border-[#24242A] bg-[#16161A] text-white text-right"
                          />
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-[#666675]">Skip:</span>
                          <input
                            type="number"
                            value={data.skipped ?? ''}
                            onChange={(e) => handleSectionChange(key, 'skipped', e.target.value)}
                            placeholder="-"
                            className="w-14 px-1.5 py-0.5 rounded border border-[#24242A] bg-[#16161A] text-white text-right"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total summary bar */}
            <div className="mt-3 p-3.5 bg-[#0C0C0E] border border-[#24242A] rounded-xl flex items-center justify-between text-xs font-medium text-[#8E8E9F]">
              <span className="font-semibold uppercase tracking-widest text-[#666675] text-[10px]">
                Calculated Total
              </span>
              <div className="flex items-center space-x-6">
                <span>
                  Overall Score:{' '}
                  <strong className="text-sm font-bold font-mono text-white">
                    {calculatedTotalMarks.toFixed(2)}
                  </strong>
                </span>
                <span>
                  Total Time:{' '}
                  <strong className="text-sm font-bold font-mono text-white">
                    {calculatedTotalTime} mins
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Free-text Mistake Log */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#8E8E9F]">
                Natural Mistake Log *
              </label>
              <span className="text-xs text-[#666675]">
                Describe naturally — AI will extract your patterns
              </span>
            </div>
            <textarea
              id="mock-mistake-log-textarea"
              rows={4}
              value={mistakeLog}
              onChange={(e) => setMistakeLog(e.target.value)}
              placeholder="e.g., In Legal Reasoning I understood the passage but chose the wrong answer because I overthought it and second-guessed option B. In Quant I panicked on the DI set due to calculation errors. In English I rushed passage 3 and misread the question stem."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#24242A] bg-[#0C0C0E] text-white focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none placeholder:text-[#666675]"
            />
            <p className="text-xs text-[#666675] mt-1.5">
              Tip: The AI extracts patterns like concept gaps, misreading, careless errors, poor elimination, time pressure, and overthinking directly from this text.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#24242A] bg-[#16161A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-[#8E8E9F] hover:text-white transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || isAnalyzing}
              id="mock-save-only-btn"
              className="flex-1 sm:flex-initial px-4 py-2 text-sm font-medium rounded-lg border border-[#2D2D33] bg-[#0C0C0E] text-white hover:bg-[#24242A] transition-colors"
            >
              Save Only
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || isAnalyzing}
              id="mock-save-and-analyze-btn"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting || isAnalyzing ? 'Analyzing...' : 'Save & Run AI Analysis'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
