import React from 'react';
import {
  FileText,
  Layers,
  Sparkles,
  BookMarked,
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock,
  ExternalLink,
  Lightbulb
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

export default function DashboardView({ dashboardData, onNavigate }) {
  const stats = dashboardData || {};
  const topicData = stats.topic_distribution || [];
  const methodologies = stats.common_methodologies || [];
  const recentPapers = stats.recent_papers || [];
  const recentActivities = stats.recent_activities || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Literature Intelligence Active</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Welcome to ResearchGap AI Intelligence Hub
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Transform raw academic PDFs into structured research intelligence. Ask natural-language questions with verified citations, compare multi-paper methodologies, explore relationship knowledge graphs, and discover unexplored research opportunities.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('rag_chat')}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <span>Ask Your Papers (RAG)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('compare')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
            >
              <span>Compare Methodologies</span>
            </button>
            <button
              onClick={() => onNavigate('gaps')}
              className="px-4 py-2 rounded-lg bg-pink-950/60 hover:bg-pink-900/60 text-pink-300 border border-pink-500/40 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Lightbulb className="w-3.5 h-3.5 text-pink-400" />
              <span>Explore Research Gaps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="academic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Processed Papers</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.uploaded_papers_count ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">100%</span> parsed via PyMuPDF
          </div>
        </div>

        <div className="academic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Indexed Chunks</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.total_chunks_indexed ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-indigo-400 font-semibold">384-d</span> FAISS vector space
          </div>
        </div>

        <div className="academic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Library Papers</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookMarked className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.saved_papers_count ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Available for multi-paper comparison</span>
          </div>
        </div>

        <div className="academic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Identified Gaps</span>
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">3</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-pink-400 font-semibold">Actionable</span> experimental designs
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Research Domain Distribution */}
        <div className="academic-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white text-sm">Research Domain Distribution</h3>
              <p className="text-xs text-slate-400">Taxonomy of indexed literature</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="h-64 w-full">
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="topic" stroke="#64748B" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No domain data yet</div>
            )}
          </div>
        </div>

        {/* Commonly Used Methodologies / Algorithms */}
        <div className="academic-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white text-sm">Extracted Algorithms & Models</h3>
              <p className="text-xs text-slate-400">Frequency of technical approaches</p>
            </div>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="space-y-3">
            {methodologies.length > 0 ? (
              methodologies.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-200">{m.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    {m.count} papers
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">No methodologies extracted yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Documents & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Papers */}
        <div className="academic-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">Recently Ingested Academic Documents</h3>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentPapers.map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigate('library')}
                className="p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition flex items-center justify-between"
              >
                <div className="space-y-1 max-w-[80%]">
                  <h4 className="text-xs font-semibold text-slate-100 line-clamp-1">{p.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{Array.isArray(p.authors) ? p.authors.slice(0, 2).join(', ') : p.authors}</span>
                    <span>•</span>
                    <span>{p.year}</span>
                    <span>•</span>
                    <span className="text-indigo-300">{p.topic}</span>
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Ready
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="academic-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-white text-sm">Recent Research Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((act) => (
              <div key={act.id} className="text-xs border-l-2 border-indigo-500 pl-3 py-1">
                <p className="text-slate-200 line-clamp-2 leading-relaxed">{act.description}</p>
                <span className="text-[10px] text-slate-400">
                  {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
