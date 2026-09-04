import React, { useRef, useState } from 'react';
import { exportAllData, importDataFromFile } from '../utils/storage';
import { MockTest, DailyLog, AIPriorityReport } from '../types';
import { X, Download, Upload, Trash2, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  mocks: MockTest[];
  logs: DailyLog[];
  onDataImported: (data: { mocks: MockTest[]; logs: DailyLog[]; priorities: AIPriorityReport | null }) => void;
  onClearAllData: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  mocks,
  logs,
  onDataImported,
  onClearAllData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importDataFromFile(
      file,
      (imported) => {
        onDataImported(imported);
        setStatusMessage({ text: `Successfully imported ${imported.mocks.length} mocks and ${imported.logs.length} study logs!`, isError: false });
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      (errorMsg) => {
        setStatusMessage({ text: errorMsg, isError: true });
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-stone-900 rounded-xl shadow-2xl max-w-md w-full border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-stone-600 dark:text-stone-300" />
            <h2 className="text-base font-semibold text-stone-900 dark:text-white">
              Data Management & Backup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start space-x-2 ${
                statusMessage.isError
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
              }`}
            >
              {statusMessage.isError ? (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Current Counts */}
          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-300 flex justify-between">
            <span>Stored in Local Database:</span>
            <strong className="text-stone-900 dark:text-white">
              {mocks.length} mocks • {logs.length} study logs
            </strong>
          </div>

          {/* Export */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wider">
              Export Backup
            </h3>
            <p className="text-xs text-stone-500">
              Download your complete CLAT preparation history as a JSON backup file.
            </p>
            <button
              onClick={() => {
                exportAllData();
                setStatusMessage({ text: 'Backup downloaded successfully.', isError: false });
              }}
              className="w-full mt-1.5 inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
            <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wider">
              Import Backup
            </h3>
            <p className="text-xs text-stone-500">
              Restore previously saved mocks and daily study logs.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="w-full mt-1.5 inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Backup File</span>
            </button>
          </div>

          {/* Reset / Clear */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
            <h3 className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Reset Application
            </h3>
            <p className="text-xs text-stone-500">
              Permanently wipe all locally stored mocks and study logs.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all mocks and study logs? This will leave the app completely empty.')) {
                  onClearAllData();
                  onClose();
                }
              }}
              className="w-full mt-1.5 inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
