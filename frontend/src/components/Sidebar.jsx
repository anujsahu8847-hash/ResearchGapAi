import React from 'react';
import {
  LayoutDashboard,
  Search,
  BookMarked,
  FileUp,
  Scale,
  Network,
  MessageSquareText,
  Lightbulb,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, section: 'Overview' },
  { id: 'discover', label: 'Discover Papers', icon: Search, badge: 'Crossref', section: 'Literature Discovery' },
  { id: 'library', label: 'Research Library', icon: BookMarked, badge: null, section: 'Literature Discovery' },
  { id: 'upload', label: 'PDF Ingestion', icon: FileUp, badge: 'PyMuPDF', section: 'Document Processing' },
  { id: 'compare', label: 'Method Comparison', icon: Scale, badge: null, section: 'Analysis & Intelligence' },
  { id: 'knowledge_map', label: 'Knowledge Map', icon: Network, badge: null, section: 'Analysis & Intelligence' },
  { id: 'rag_chat', label: 'Ask Your Papers', icon: MessageSquareText, badge: 'RAG', section: 'AI Research Assistant' },
  { id: 'gaps', label: 'Research Gaps', icon: Lightbulb, badge: 'AI Synthesis', section: 'AI Research Assistant' },
  { id: 'evaluation', label: 'System Evaluation', icon: CheckCircle, badge: 'Sec 12', section: 'Metrics & Transparency' },
];

export default function Sidebar({ activeTab, onSelectTab, papersCount, gapsCount }) {
  // Group nav items by section
  const sections = ['Overview', 'Literature Discovery', 'Document Processing', 'Analysis & Intelligence', 'AI Research Assistant', 'Metrics & Transparency'];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 p-4 select-none">
      <div className="space-y-6 flex-1 overflow-y-auto pr-1">
        {sections.map((sec) => {
          const items = NAV_ITEMS.filter((i) => i.section === sec);
          return (
            <div key={sec}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-3">
                {sec}
              </h3>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  let dynamicBadge = item.badge;
                  if (item.id === 'library' && papersCount > 0) dynamicBadge = papersCount;
                  if (item.id === 'gaps' && gapsCount > 0) dynamicBadge = `${gapsCount} Found`;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {dynamicBadge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            isActive
                              ? 'bg-indigo-500/30 text-indigo-200'
                              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                          }`}
                        >
                          {dynamicBadge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-slate-800">
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">RAG Groundedness</p>
          <p className="text-[10px] leading-relaxed">
            All AI responses cite verified page provenance <code className="text-indigo-300">[Paper, p. X]</code>.
          </p>
        </div>
      </div>
    </aside>
  );
}
