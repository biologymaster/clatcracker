import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  CalendarDays, 
  Sparkles, 
  TrendingUp, 
  Plus, 
  Database,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddMock: () => void;
  onOpenAddLog: () => void;
  onOpenBackup: () => void;
  mockCount: number;
  logCount: number;
  children?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddMock,
  onOpenAddLog,
  onOpenBackup,
  mockCount,
  logCount,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'mocks', label: 'Mock Analysis', icon: <FileText className="w-4 h-4" />, badge: mockCount },
    { id: 'dailylog', label: 'Daily Study Log', icon: <CalendarDays className="w-4 h-4" />, badge: logCount },
    { id: 'priorities', label: 'AI Priorities', icon: <Sparkles className="w-4 h-4 text-[#6366F1]" /> },
    { id: 'progress', label: 'Progress History', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const engineStatus = mockCount > 0 
    ? `${mockCount} Mock${mockCount > 1 ? 's' : ''} Analyzed`
    : logCount > 0 
    ? `${logCount} Logs Active`
    : 'Awaiting Initial Data';

  return (
    <div className="flex h-screen w-full bg-[#0C0C0E] text-[#E0E0E6] font-sans overflow-hidden">
      {/* Desktop Sidebar: Sophisticated Dark */}
      <aside className="hidden lg:flex w-64 border-r border-[#24242A] flex-col bg-[#0C0C0E] h-screen shrink-0 select-none">
        <div className="p-8 pb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left focus:outline-none group block"
            id="nav-logo-btn"
          >
            <h1 className="text-2xl font-serif italic text-[#6366F1] tracking-tight transition-colors group-hover:text-indigo-400">
              CLATCracker
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#666675] mt-1 font-medium">
              Personal AI Performance Engine
            </p>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#16161A] text-white border border-[#2D2D33] shadow-xs'
                    : 'text-[#8E8E9F] hover:bg-[#16161A] hover:text-[#E0E0E6]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                        : 'border border-[#8E8E9F]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-xs rounded font-mono ${
                      isActive
                        ? 'bg-[#24242A] text-white border border-[#2D2D33]'
                        : 'bg-[#16161A] text-[#8E8E9F]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Aspirant Profile & Data Management */}
        <div className="p-5 border-t border-[#24242A] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#24242A] border border-[#2D2D33] flex items-center justify-center text-xs font-serif italic text-[#E0E0E6]">
              CC
            </div>
            <div>
              <p className="text-xs font-semibold text-white">CLAT Aspirant</p>
              <p className="text-[10px] text-[#666675] uppercase tracking-wider">Performance Mode</p>
            </div>
          </div>
          <button
            onClick={onOpenBackup}
            title="Backup, export or import data"
            id="backup-btn"
            className="p-2 text-[#8E8E9F] hover:text-white rounded-lg hover:bg-[#16161A] border border-transparent hover:border-[#2D2D33] transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (When Open) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative w-64 max-w-[80vw] bg-[#0C0C0E] border-r border-[#24242A] flex flex-col h-full z-10 p-6">
            <div className="flex items-center justify-between pb-6 border-b border-[#24242A]">
              <div>
                <h1 className="text-xl font-serif italic text-[#6366F1]">CLATCracker</h1>
                <p className="text-[9px] uppercase tracking-widest text-[#666675] mt-0.5">AI Performance Engine</p>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#8E8E9F] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-drawer-tab-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-[#16161A] text-white border border-[#2D2D33]'
                        : 'text-[#8E8E9F] hover:bg-[#16161A] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#6366F1]' : 'border border-[#8E8E9F]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="text-xs px-1.5 py-0.2 rounded bg-[#24242A] text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#24242A] flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenBackup();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center space-x-2 text-xs text-[#8E8E9F] hover:text-white"
              >
                <Database className="w-4 h-4" />
                <span>Backup & Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#0A0A0A] overflow-hidden min-w-0">
        {/* Top Header Bar for Main Content Area: Sophisticated Dark */}
        <header className="h-16 sm:h-20 border-b border-[#24242A] px-4 sm:px-8 lg:px-10 flex items-center justify-between shrink-0 bg-[#0C0C0E]/90 backdrop-blur-sm sticky top-0 z-30">
          {/* Left Status or Mobile Menu */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#8E8E9F] hover:text-white rounded-lg hover:bg-[#16161A] border border-[#24242A]"
              id="mobile-nav-toggle-btn"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#666675] uppercase tracking-widest hidden sm:inline-block font-semibold">
                Engine Status:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#16161A] border border-[#2D2D33] text-[10px] text-[#A0A0B0] uppercase font-medium flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
                <span>{engineStatus}</span>
              </span>
            </div>
          </div>

          {/* Right CTA Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onOpenBackup}
              title="Backup, export or import data"
              id="header-backup-btn"
              className="lg:hidden p-2 text-[#8E8E9F] hover:text-white rounded-lg hover:bg-[#16161A] border border-[#2D2D33] transition-colors"
            >
              <Database className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAddLog}
              id="action-add-log-btn"
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-[#16161A] border border-[#2D2D33] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#24242A] transition-colors shadow-xs flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Daily Study</span>
            </button>

            <button
              onClick={onOpenAddMock}
              id="action-add-mock-btn"
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#6366F1] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#4F46E5] transition-colors shadow-xs flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Mock Result</span>
            </button>
          </div>
        </header>

        {/* Scrolling Views Container */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

