import React, { useState, useEffect } from 'react';
import { ActiveTab, MockTest, DailyLog, AIPriorityReport } from './types';
import { 
  getStoredMocks, 
  saveStoredMocks, 
  getStoredLogs, 
  saveStoredLogs, 
  getStoredPriorities, 
  saveStoredPriorities 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { MocksView } from './components/MocksView';
import { DailyLogView } from './components/DailyLogView';
import { AIPrioritiesView } from './components/AIPrioritiesView';
import { ProgressView } from './components/ProgressView';
import { MockModal } from './components/MockModal';
import { DailyLogModal } from './components/DailyLogModal';
import { BackupModal } from './components/BackupModal';

export default function App() {
  // 100% EMPTY on initial launch. No sample or mock records whatsoever!
  const [mocks, setMocks] = useState<MockTest[]>(() => getStoredMocks());
  const [logs, setLogs] = useState<DailyLog[]>(() => getStoredLogs());
  const [priorities, setPriorities] = useState<AIPriorityReport | null>(() => getStoredPriorities());

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals state
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [editingMock, setEditingMock] = useState<MockTest | null>(null);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<DailyLog | null>(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Loading states
  const [analyzingMockId, setAnalyzingMockId] = useState<string | null>(null);
  const [isGeneratingPriorities, setIsGeneratingPriorities] = useState(false);
  const [globalNotification, setGlobalNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setGlobalNotification({ message, type });
    setTimeout(() => setGlobalNotification(null), 4000);
  };

  // 1. Analyze single mock
  const handleAnalyzeMock = async (mockToAnalyze: MockTest) => {
    setAnalyzingMockId(mockToAnalyze.id);
    try {
      const previousMocks = mocks.filter((m) => m.id !== mockToAnalyze.id);
      const res = await fetch('/api/analyze-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentMock: mockToAnalyze, previousMocks }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to analyze mock.');
      }

      const analysis = await res.json();
      const updatedMock: MockTest = {
        ...mockToAnalyze,
        aiAnalysis: analysis,
      };

      const updatedMocks = mocks.map((m) => (m.id === updatedMock.id ? updatedMock : m));
      setMocks(updatedMocks);
      saveStoredMocks(updatedMocks);
      showNotification(`AI Analysis complete for "${updatedMock.title}"`);
    } catch (err: any) {
      console.error('Analysis error:', err);
      showNotification(err.message || 'Error analyzing mock.', 'error');
    } finally {
      setAnalyzingMockId(null);
    }
  };

  // 2. Save mock (create or edit)
  const handleSaveMock = async (newMock: MockTest, triggerAi: boolean) => {
    const existingIndex = mocks.findIndex((m) => m.id === newMock.id);
    let updatedMocks: MockTest[];

    if (existingIndex >= 0) {
      updatedMocks = [...mocks];
      updatedMocks[existingIndex] = newMock;
    } else {
      updatedMocks = [...mocks, newMock];
    }

    setMocks(updatedMocks);
    saveStoredMocks(updatedMocks);
    showNotification(`Saved "${newMock.title}"`);

    if (triggerAi) {
      await handleAnalyzeMock(newMock);
    }
  };

  // 3. Delete mock
  const handleDeleteMock = (id: string) => {
    const updated = mocks.filter((m) => m.id !== id);
    setMocks(updated);
    saveStoredMocks(updated);
    showNotification('Mock test removed.');
  };

  // 4. Save daily log
  const handleSaveLog = (newLog: DailyLog) => {
    const existingIndex = logs.findIndex((l) => l.id === newLog.id);
    let updatedLogs: DailyLog[];

    if (existingIndex >= 0) {
      updatedLogs = [...logs];
      updatedLogs[existingIndex] = newLog;
    } else {
      // Newest logs at the front
      updatedLogs = [newLog, ...logs];
    }

    setLogs(updatedLogs);
    saveStoredLogs(updatedLogs);
    showNotification('Daily study session recorded.');
  };

  // 5. Delete daily log
  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    saveStoredLogs(updated);
    showNotification('Study log removed.');
  };

  // 6. Generate AI Priorities
  const handleGeneratePriorities = async () => {
    setIsGeneratingPriorities(true);
    try {
      const res = await fetch('/api/generate-priorities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mocks, logs }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate priorities.');
      }

      const report: AIPriorityReport = await res.json();
      setPriorities(report);
      saveStoredPriorities(report);
      showNotification('AI Priorities updated for today.');
    } catch (err: any) {
      console.error('Priorities error:', err);
      showNotification(err.message || 'Error generating priorities.', 'error');
    } finally {
      setIsGeneratingPriorities(false);
    }
  };

  // 7. Clear all data
  const handleClearAllData = () => {
    setMocks([]);
    setLogs([]);
    setPriorities(null);
    saveStoredMocks([]);
    saveStoredLogs([]);
    saveStoredPriorities(null);
    showNotification('All preparation data cleared. App is now completely empty.', 'info');
  };

  // 8. Import data
  const handleDataImported = (imported: { mocks: MockTest[]; logs: DailyLog[]; priorities: AIPriorityReport | null }) => {
    setMocks(imported.mocks);
    setLogs(imported.logs);
    setPriorities(imported.priorities);
    showNotification('Data backup imported successfully!');
  };

  return (
    <div className="h-screen w-full bg-[#0C0C0E] text-[#E0E0E6] overflow-hidden selection:bg-[#6366F1] selection:text-white font-sans antialiased">
      {/* Toast Notification */}
      {globalNotification && (
        <div
          id="global-toast"
          className={`fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-xl border transition-all animate-in fade-in slide-in-from-bottom-3 ${
            globalNotification.type === 'error'
              ? 'bg-rose-950 text-rose-200 border-rose-800'
              : globalNotification.type === 'info'
              ? 'bg-[#16161A] text-white border-[#2D2D33]'
              : 'bg-emerald-950 text-emerald-200 border-emerald-800'
          }`}
        >
          {globalNotification.message}
        </div>
      )}

      {/* Main App Layout */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddMock={() => {
          setEditingMock(null);
          setIsMockModalOpen(true);
        }}
        onOpenAddLog={() => {
          setEditingLog(null);
          setIsLogModalOpen(true);
        }}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        mockCount={mocks.length}
        logCount={logs.length}
      >
        {activeTab === 'dashboard' && (
          <DashboardView
            mocks={mocks}
            logs={logs}
            priorities={priorities}
            onNavigate={setActiveTab}
            onOpenAddMock={() => {
              setEditingMock(null);
              setIsMockModalOpen(true);
            }}
            onOpenAddLog={() => {
              setEditingLog(null);
              setIsLogModalOpen(true);
            }}
            onGeneratePriorities={handleGeneratePriorities}
            isGeneratingPriorities={isGeneratingPriorities}
          />
        )}

        {activeTab === 'mocks' && (
          <MocksView
            mocks={mocks}
            onOpenAddMock={() => {
              setEditingMock(null);
              setIsMockModalOpen(true);
            }}
            onEditMock={(m) => {
              setEditingMock(m);
              setIsMockModalOpen(true);
            }}
            onDeleteMock={handleDeleteMock}
            onAnalyzeMock={handleAnalyzeMock}
            analyzingMockId={analyzingMockId}
          />
        )}

        {activeTab === 'dailylog' && (
          <DailyLogView
            logs={logs}
            onOpenAddLog={() => {
              setEditingLog(null);
              setIsLogModalOpen(true);
            }}
            onEditLog={(l) => {
              setEditingLog(l);
              setIsLogModalOpen(true);
            }}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {activeTab === 'priorities' && (
          <AIPrioritiesView
            priorities={priorities}
            mocks={mocks}
            logs={logs}
            onGenerate={handleGeneratePriorities}
            isGenerating={isGeneratingPriorities}
            onOpenAddMock={() => {
              setEditingMock(null);
              setIsMockModalOpen(true);
            }}
            onOpenAddLog={() => {
              setEditingLog(null);
              setIsLogModalOpen(true);
            }}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            mocks={mocks}
            logs={logs}
          />
        )}
      </Navbar>

      {/* Modals */}
      <MockModal
        isOpen={isMockModalOpen}
        onClose={() => {
          setIsMockModalOpen(false);
          setEditingMock(null);
        }}
        onSave={handleSaveMock}
        initialMock={editingMock}
        isAnalyzing={Boolean(analyzingMockId)}
      />

      <DailyLogModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditingLog(null);
        }}
        onSave={handleSaveLog}
        initialLog={editingLog}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        mocks={mocks}
        logs={logs}
        onDataImported={handleDataImported}
        onClearAllData={handleClearAllData}
      />
    </div>
  );
}
