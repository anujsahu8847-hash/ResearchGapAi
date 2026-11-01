import React, { useState, useEffect } from 'react';
import {
  Scale,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { fetchLibraryPapers, comparePapers } from '../api';

const PARAMETER_LABELS = {
  research_problem: 'Research Problem',
  objectives: 'Research Objectives',
  methodology: 'Proposed Methodology',
  algorithms: 'Algorithms & Models',
  datasets: 'Datasets & Benchmarks',
  experimental_setup: 'Experimental Setup',
  metrics: 'Evaluation Metrics',
  results: 'Reported Results',
  strengths: 'Core Strengths',
  limitations: 'Stated Limitations',
  future_work: 'Future Work Directions'
};

export default function ComparisonView() {
  const [libraryPapers, setLibraryPapers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      const data = await fetchLibraryPapers();
      const papers = data.papers || [];
      setLibraryPapers(papers);
      // Default select first 2 or 3 papers if available
      if (papers.length >= 2) {
        setSelectedIds([papers[0].id, papers[1].id]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelect = (paperId) => {
    setSelectedIds((prev) =>
      prev.includes(paperId) ? prev.filter((id) => id !== paperId) : [...prev, paperId]
    );
  };

  const handleRunComparison = async () => {
    if (selectedIds.length < 2) {
      setError('Please select at least 2 papers to generate a comparative analysis.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await comparePapers(selectedIds);
      setComparisonResult(res);
    } catch (err) {
      setError(err.message || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Multi-Paper Methodology Comparison</h2>
        <p className="text-xs text-slate-400 mt-1">
          Systematic side-by-side comparative matrix across 11 key academic dimensions, highlighting algorithmic divergences and shared foundations.
        </p>
      </div>

      {/* Paper Selector Card */}
      <div className="academic-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Select Papers for Comparison ({selectedIds.length} Selected)</span>
          </h3>
          <button
            onClick={handleRunComparison}
            disabled={selectedIds.length < 2 || loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? 'Analyzing...' : 'Generate Comparison Matrix'}</span>
          </button>
        </div>

        {error && (
          <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {libraryPapers.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                }`}
              >
                <div className="pt-0.5">
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="tag-pill tag-topic text-[10px]">{p.topic || 'General'}</span>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 leading-tight">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">{p.publication_year}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Similarities and Divergences Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="academic-card p-5 border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-400 mb-3 font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Methodological Similarities</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {comparisonResult.similarities.map((sim, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{sim}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="academic-card p-5 border-indigo-500/30 bg-indigo-950/20">
              <div className="flex items-center gap-2 text-indigo-400 mb-3 font-semibold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Key Algorithmic Differences</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {comparisonResult.differences.map((diff, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Side-by-Side Parameter Matrix */}
          <div className="academic-card overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Side-by-Side Comparison Matrix (11 Parameters)</h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {comparisonResult.compared_papers.length} Papers Under Review
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="p-4 text-slate-400 font-semibold uppercase tracking-wider w-44 shrink-0">
                      Parameter
                    </th>
                    {comparisonResult.compared_papers.map((p) => (
                      <th key={p.id} className="p-4 text-slate-200 font-semibold min-w-[280px]">
                        <span className="tag-pill tag-paper mb-1 block w-fit">Paper #{p.id}</span>
                        <div className="text-white text-xs font-bold line-clamp-2">{p.title}</div>
                        <div className="text-[10px] text-indigo-300 mt-0.5">{p.year} • {p.topic}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {comparisonResult.comparison_parameters.map((paramKey) => {
                    const label = PARAMETER_LABELS[paramKey] || paramKey;
                    return (
                      <tr key={paramKey} className="hover:bg-slate-800/30 transition">
                        <td className="p-4 font-semibold text-slate-300 bg-slate-900/40 align-top">
                          {label}
                        </td>
                        {comparisonResult.compared_papers.map((p) => {
                          const val = p[paramKey];
                          let rendered = null;

                          if (Array.isArray(val)) {
                            rendered = (
                              <div className="flex flex-wrap gap-1.5">
                                {val.map((item, idx) => (
                                  <span key={idx} className="tag-pill tag-algorithm text-[11px]">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            );
                          } else if (typeof val === 'string') {
                            rendered = (
                              <p className="text-slate-300 leading-relaxed font-serif text-[11px]">
                                {val}
                              </p>
                            );
                          } else {
                            rendered = <span className="text-slate-500">N/A</span>;
                          }

                          return (
                            <td key={p.id} className="p-4 align-top">
                              {rendered}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
