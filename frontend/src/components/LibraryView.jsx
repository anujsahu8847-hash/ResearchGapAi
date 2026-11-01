import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Trash2,
  Download,
  Eye,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  CheckCircle2
} from 'lucide-react';
import { fetchLibraryPapers, fetchPaperDetail, deletePaper, getExportCSVUrl } from '../api';

export default function LibraryView({ onSelectPaperForRAG, onSelectPaperForComparison }) {
  const [papers, setPapers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [loading, setLoading] = useState(false);
  const [detailModalPaper, setDetailModalPaper] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadPapers = async () => {
    setLoading(true);
    try {
      const data = await fetchLibraryPapers(search, selectedTopic);
      setPapers(data.papers || []);
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, [search, selectedTopic]);

  const handleDelete = async (paperId, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}' from your library?`)) return;
    try {
      await deletePaper(paperId);
      loadPapers();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleOpenDetail = async (paperId) => {
    setModalLoading(true);
    try {
      const detail = await fetchPaperDetail(paperId);
      setDetailModalPaper(detail);
    } catch (err) {
      alert(`Could not load paper detail: ${err.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">My Research Library</h2>
          <p className="text-xs text-slate-400 mt-1">
            Centralized document management, structured parameters, and vector-indexed academic literature.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={getExportCSVUrl()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition"
            download="researchgap_library.csv"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="academic-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or keyword within your library..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Topics</option>
          <option value="Natural Language Processing">Natural Language Processing</option>
          <option value="Healthcare & Privacy">Healthcare & Privacy</option>
          <option value="Bioinformatics">Bioinformatics & Drug Discovery</option>
          <option value="Computer Science">Computer Science</option>
        </select>
      </div>

      {/* Papers Grid */}
      <div className="space-y-4">
        {papers.map((p) => {
          const authors = Array.isArray(p.authors) ? p.authors.join(', ') : p.authors;
          return (
            <div key={p.id} className="academic-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="tag-pill tag-paper font-mono">#{p.id}</span>
                    <span className="tag-pill tag-topic">{p.topic || 'General'}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Indexed
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-base leading-snug">{p.title}</h3>
                  <p className="text-xs text-indigo-300 font-medium">{authors}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDetail(p.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
                    title="Inspect Extracted Information & Chunks"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/30 text-xs transition"
                    title="Delete Paper"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-serif line-clamp-2">
                {p.abstract}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-4">
                  <span>Year: <strong className="text-slate-200">{p.publication_year}</strong></span>
                  <span>Source: <strong className="text-slate-200">{p.source}</strong></span>
                  {p.file_size > 0 && (
                    <span>Size: <strong className="text-slate-200">{(p.file_size / 1024).toFixed(1)} KB</strong></span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectPaperForRAG(p.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Ask in RAG →
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {papers.length === 0 && !loading && (
          <div className="p-12 text-center academic-card">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">Your Research Library is Empty</h3>
            <p className="text-xs text-slate-500 mt-1">Upload a PDF or click "Ingest Sample Papers" in the top bar to get started.</p>
          </div>
        )}
      </div>

      {/* Detailed Inspection Modal */}
      {detailModalPaper && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="tag-pill tag-topic mb-2">{detailModalPaper.paper.topic}</span>
                <h3 className="text-lg font-bold text-white">{detailModalPaper.paper.title}</h3>
                <p className="text-xs text-indigo-300 mt-1">{detailModalPaper.paper.authors.join(', ')}</p>
              </div>
              <button
                onClick={() => setDetailModalPaper(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Extracted Parameters */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                Structured Academic Extraction
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60">
                  <strong className="text-indigo-400 block mb-1">Research Problem:</strong>
                  <p className="text-slate-300">{detailModalPaper.extractions?.research_problem || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60">
                  <strong className="text-purple-400 block mb-1">Proposed Methodology:</strong>
                  <p className="text-slate-300">{detailModalPaper.extractions?.methodology || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60">
                  <strong className="text-emerald-400 block mb-1">Reported Results:</strong>
                  <p className="text-slate-300">{detailModalPaper.extractions?.results || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60">
                  <strong className="text-rose-400 block mb-1">Stated Limitations:</strong>
                  <ul className="list-disc pl-4 text-slate-300 space-y-1">
                    {detailModalPaper.extractions?.limitations?.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Document Chunks */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Indexed Vector Chunks ({detailModalPaper.total_chunks})</span>
                <span className="text-[10px] text-slate-500">Sliding Window (overlap 50w)</span>
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {detailModalPaper.chunks.map((ch) => (
                  <div key={ch.id} className="p-2.5 rounded bg-slate-800/50 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="text-indigo-300 font-mono">Chunk #{ch.chunk_index} (Page {ch.page_number})</span>
                      <span className="tag-pill tag-topic">{ch.section_name}</span>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed line-clamp-3">
                      {ch.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
