import { MockTest, DailyLog, AIPriorityReport } from '../types';

const MOCKS_KEY = 'clatcracker_mocks_v1';
const LOGS_KEY = 'clatcracker_daily_logs_v1';
const PRIORITIES_KEY = 'clatcracker_priorities_v1';

export function getStoredMocks(): MockTest[] {
  try {
    const raw = localStorage.getItem(MOCKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse stored mocks:', e);
    return [];
  }
}

export function saveStoredMocks(mocks: MockTest[]): void {
  try {
    localStorage.setItem(MOCKS_KEY, JSON.stringify(mocks));
  } catch (e) {
    console.error('Failed to save mocks to storage:', e);
  }
}

export function getStoredLogs(): DailyLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse stored daily logs:', e);
    return [];
  }
}

export function saveStoredLogs(logs: DailyLog[]): void {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save daily logs to storage:', e);
  }
}

export function getStoredPriorities(): AIPriorityReport | null {
  try {
    const raw = localStorage.getItem(PRIORITIES_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored priorities:', e);
    return null;
  }
}

export function saveStoredPriorities(report: AIPriorityReport | null): void {
  try {
    if (!report) {
      localStorage.removeItem(PRIORITIES_KEY);
    } else {
      localStorage.setItem(PRIORITIES_KEY, JSON.stringify(report));
    }
  } catch (e) {
    console.error('Failed to save priorities to storage:', e);
  }
}

export function exportAllData(): void {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    mocks: getStoredMocks(),
    dailyLogs: getStoredLogs(),
    priorities: getStoredPriorities(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const today = new Date().toISOString().split('T')[0];
  a.download = `clatcracker-data-${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importDataFromFile(
  file: File,
  onSuccess: (data: { mocks: MockTest[]; logs: DailyLog[]; priorities: AIPriorityReport | null }) => void,
  onError: (msg: string) => void
): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsed = JSON.parse(content);
      const mocks = Array.isArray(parsed.mocks) ? parsed.mocks : [];
      const logs = Array.isArray(parsed.dailyLogs) ? parsed.dailyLogs : [];
      const priorities = parsed.priorities || null;

      saveStoredMocks(mocks);
      saveStoredLogs(logs);
      saveStoredPriorities(priorities);

      onSuccess({ mocks, logs, priorities });
    } catch (err: any) {
      onError('Invalid JSON backup file. Please select a valid CLATCracker export file.');
    }
  };
  reader.onerror = () => {
    onError('Failed to read backup file.');
  };
  reader.readAsText(file);
}
