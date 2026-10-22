import React from 'react';
import { TabType } from '../types';
import { Search, Network, Zap, Shield, FileCode2, Terminal, ExternalLink } from 'lucide-react';

interface TopNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenDocs?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  onOpenDocs,
}) => {
  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    {
      id: 'rag',
      label: 'RAG & Vector 2D',
      icon: <Search className="w-3.5 h-3.5 text-blue-400" />,
    },
    {
      id: 'langgraph',
      label: 'LangGraph Simulator',
      icon: <Network className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      id: 'cache',
      label: 'Semantic Cache & Cost',
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      id: 'security',
      label: 'AI Security Firewall',
      icon: <Shield className="w-3.5 h-3.5 text-red-400" />,
    },
    {
      id: 'jsonlab',
      label: 'Self-Healing JSON Lab',
      icon: <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />,
    },
  ];

  return (
    <header className="h-12 border-b border-neutral-800 bg-[#09090b] px-4 flex items-center justify-between shrink-0 select-none z-30">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="/"
          className="text-xs font-bold tracking-tight text-neutral-100 flex items-center gap-2 font-mono whitespace-nowrap"
        >
          <div className="w-5 h-5 bg-neutral-900 border border-neutral-700 flex items-center justify-center text-blue-400 font-black text-[10px]">
            AI
          </div>
          <span className="uppercase text-neutral-200">AI Eng Studio</span>
        </a>
        <span className="text-neutral-700 font-mono text-xs">/</span>
        <span className="text-[11px] text-neutral-400 font-mono hidden md:inline">
          Interactive Applied AI Visual Lab
        </span>
      </div>

      {/* Zone 2: Single-line Tab Controls */}
      <nav className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`h-8 px-2.5 text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                isActive
                  ? 'border-neutral-700 bg-neutral-900 text-neutral-100 font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenDocs}
          className="h-7 px-2.5 text-xs font-mono text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center gap-1.5"
        >
          <Terminal className="w-3 h-3 text-emerald-400" />
          <span>Spec & Invariants</span>
        </button>
      </div>
    </header>
  );
};
