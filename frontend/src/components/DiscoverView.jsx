import React, { useState, useEffect } from 'react';
import {
  Search,
  BookPlus,
  Check,
  Filter,
  ExternalLink,
  Sparkles,
  BookOpen,
  Calendar,
  Tag
} from 'lucide-react';
import { discoverPapers, saveToLibrary } from '../api';

const TOPICS = [
  'All',
  'Natural Language Processing',
  'Healthcare & Privacy',
  'Bioinformatics & Drug Discovery',
  'Efficient Deep Learning',
  'Retrieval & Knowledge Graphs'
];

export default function DiscoverView({ onPaperSaved }) {
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [yearMin, setYearMin] = useState(2022);
  const [yearMax, setYearMax] = useState(2025);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingId, setSavingId] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await discoverPapers(query, selectedTopic === 'All' ? '' : selectedTopic, yearMin, yearMax);
      setPapers(data.papers || []);
    } catch (err) {
      console.error('Failed to discover papers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedTopic, yearMin, yearMax]);

  const handleSave = async (paper, index) => {
    setSavingId(index);
    try {
      await saveToLibrary(paper);
      setSavedIds((prev) => new Set([...prev, index]));
      if (onPaperSaved) onPaperSaved();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Academic Literature Discovery</h2>
        <p className="text-xs text-slate-400 mt-1">
          Search indexed literature registries (CrossRef, arXiv, PubMed) using keywords or natural-language research questions.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="academic-card p-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'sparse attention mechanisms for long context' or 'federated learning non-iid clinical'..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? 'Searching...' : 'Discover'}</span>
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800 text-xs">
          {/* Topic Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Topic:
            </span>
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                  selectedTopic === t
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Year Range */}
          <div className="flex items-center gap-2 ml-auto text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Year Range:</span>
            <select
              value={yearMin}
              onChange={(e) => setYearMin(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value={2018}>2018</option>
              <option value={2020}>2020</option>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
            </select>
            <span>to</span>
            <select
              value={yearMax}
              onChange={(e) => setYearMax(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Found <strong>{papers.length}</strong> academic publications</span>
        <span>Ranked by Semantic Relevance</span>
      </div>

      {/* Papers Grid */}
      <div className="space-y-4">
        {papers.map((p, idx) => {
          const isSaved = savedIds.has(idx);
          const isSaving = savingId === idx;
          const authors = Array.isArray(p.authors) ? p.authors.join(', ') : p.authors;

          return (
            <div key={idx} className="academic-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-[85%]">
                  <span className="tag-pill tag-topic mb-1.5">{p.topic || 'Academic Paper'}</span>
                  <h3 className="font-semibold text-white text-base leading-snug">{p.title}</h3>
                  <p className="text-xs text-indigo-300 font-medium">{authors}</p>
                </div>
                <button
                  onClick={() => handleSave(p, idx)}
                  disabled={isSaved || isSaving}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    isSaved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>In Library</span>
                    </>
                  ) : (
                    <>
                      <BookPlus className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save to Library'}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-serif text-justify">
                {p.abstract}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-4">
                  <span>Published: <strong className="text-slate-200">{p.publication_year}</strong></span>
                  <span>Source: <strong className="text-slate-200">{p.source}</strong></span>
                  {p.citation_count > 0 && (
                    <span>Citations: <strong className="text-indigo-300">{p.citation_count.toLocaleString()}</strong></span>
                  )}
                </div>
                {p.doi && (
                  <a
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-mono text-[10px]"
                  >
                    <span>DOI: {p.doi}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
