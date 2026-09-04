export type SectionKey = 'english' | 'gk' | 'legal' | 'logical' | 'quant';

export interface SectionMeta {
  key: SectionKey;
  label: string;
  shortLabel: string;
  defaultQuestions: number;
  color: string;
  bgLight: string;
  borderCol: string;
}

export const CLAT_SECTIONS: Record<SectionKey, SectionMeta> = {
  english: {
    key: 'english',
    label: 'English Language',
    shortLabel: 'English',
    defaultQuestions: 24,
    color: 'text-amber-700 dark:text-amber-400',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    borderCol: 'border-amber-200 dark:border-amber-800/40',
  },
  gk: {
    key: 'gk',
    label: 'Current Affairs & GK',
    shortLabel: 'GK',
    defaultQuestions: 28,
    color: 'text-emerald-700 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderCol: 'border-emerald-200 dark:border-emerald-800/40',
  },
  legal: {
    key: 'legal',
    label: 'Legal Reasoning',
    shortLabel: 'Legal',
    defaultQuestions: 32,
    color: 'text-indigo-700 dark:text-indigo-400',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderCol: 'border-indigo-200 dark:border-indigo-800/40',
  },
  logical: {
    key: 'logical',
    label: 'Logical Reasoning',
    shortLabel: 'LR',
    defaultQuestions: 24,
    color: 'text-sky-700 dark:text-sky-400',
    bgLight: 'bg-sky-50 dark:bg-sky-950/30',
    borderCol: 'border-sky-200 dark:border-sky-800/40',
  },
  quant: {
    key: 'quant',
    label: 'Quantitative Techniques',
    shortLabel: 'Quant',
    defaultQuestions: 12,
    color: 'text-rose-700 dark:text-rose-400',
    bgLight: 'bg-rose-50 dark:bg-rose-950/30',
    borderCol: 'border-rose-200 dark:border-rose-800/40',
  },
};

export interface SectionScore {
  marks: number;
  timeMinutes: number;
  attempted?: number;
  wrong?: number;
  skipped?: number;
}

export interface ComparisonRecord {
  weakness: string;
  status: 'repeating' | 'improving' | 'worsening' | 'new';
  note: string;
}

export interface MockAIAnalysis {
  whatWentWell: string[];
  biggestProblems: string[];
  recurringPatterns: string[];
  timeProblems: string[];
  priorityWeaknesses: {
    area: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
  specificThingsToPractise: string[];
  comparisonsWithPrevious: ComparisonRecord[];
  detectedPatterns: string[];
  summary: string;
  analyzedAt: number;
}

export interface MockTest {
  id: string;
  title: string;
  date: string;
  overallScore: number;
  totalTimeMinutes: number;
  sections: Record<SectionKey, SectionScore>;
  mistakeLog: string;
  aiAnalysis?: MockAIAnalysis;
  createdAt: number;
}

export interface DailyLog {
  id: string;
  date: string;
  content: string;
  subject?: string;
  timeSpentMinutes?: number;
  questionsOrPassages?: string;
  notes?: string;
  createdAt: number;
}

export interface AIPriorityItem {
  id: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  task: string;
  rationale: string;
}

export interface AIPriorityReport {
  generatedAt: number;
  headline: string;
  dataSufficiencyNotice?: string;
  mismatches: {
    description: string;
    identifiedNeed: string;
    recentStudyTrend: string;
  }[];
  priorities: AIPriorityItem[];
  tacticalAdvice: string;
}

export type ActiveTab = 'dashboard' | 'mocks' | 'dailylog' | 'priorities' | 'progress';
