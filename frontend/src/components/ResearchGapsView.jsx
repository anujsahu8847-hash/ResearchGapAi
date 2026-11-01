import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  FlaskConical,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { fetchResearchGaps } from '../api';

export default function ResearchGapsView() {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGap, setSelectedGap] = useState(null);

  useEffect(() => {
    loadGaps();
  }, []);

  const loadGaps = async () => {
    setLoading(true);
    try {
      const data = await fetchResearchGaps();
      setGaps(data.gaps || []);
      if (data.gaps && data.gaps.length > 0) {
        setSelectedGap(data.gaps[0]);
      }
    } catch (err) {
      console.error('Failed to load gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">AI Research Gap & Opportunity Engine</h2>
            <span className="tag-pill tag-gap font-mono text-[10px]">Candidate Hypotheses</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synthesizes recurring limitations, unanswered questions, and methodological bottlenecks across multiple papers into actionable research opportunities.
          </p>
        </div>
        <button
          onClick={loadGaps}
          disabled={loading}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Epistemic Transparency Notice */}
      <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/30 text-xs text-pink-200 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-pink-300">Epistemic Uncertainty Notice (Section 4.8):</p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Research gaps generated below represent <em>candidate research directions</em> synthesized from identified limitations across the active corpus. They should be corroborated against broader domain literature and verified experimentally.
          </p>
        </div>
      </div>

      {/* Main Gaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Gaps List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Identified Research Gaps ({gaps.length})
          </h3>
          <div className="space-y-3">
            {gaps.map((g) => {
              const isSelected = selectedGap && selectedGap.id === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGap(g)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-pink-950/40 border-pink-500/60 shadow-lg shadow-pink-950/30'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="tag-pill tag-gap text-[10px]">{g.domain}</span>
                    <span className="font-mono text-[10px] text-pink-400 font-semibold">
                      {(g.confidence_score * 100).toFixed(0)}% Confidence
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {g.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-serif">
                    {g.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Deep Dive on Selected Gap */}
        <div className="lg:col-span-2 space-y-4">
          {selectedGap ? (
            <div className="academic-card p-6 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="tag-pill tag-topic">{selectedGap.domain}</span>
                  <span className="tag-pill tag-gap">High Potential Impact</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">{selectedGap.title}</h3>
                <p className="text-xs text-slate-300 font-serif leading-relaxed mt-2 text-justify">
                  {selectedGap.description}
                </p>
              </div>

              {/* Underlying Limitations in Literature */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Why This Gap Exists (Cross-Paper Limitations)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-5">
                  {selectedGap.underlying_limitations.map((lim, idx) => (
                    <li key={idx} className="leading-relaxed">{lim}</li>
                  ))}
                </ul>
              </div>

              {/* Proposed Novel Methodology */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Suggested Methodological Architecture</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-serif">
                  {selectedGap.suggested_methodology}
                </p>
              </div>

              {/* Concrete Proposed Experiments */}
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
                  <span>Proposed Experimental Protocol</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-serif">
                  {selectedGap.proposed_experiments}
                </p>
              </div>

              {/* Expected Academic Contribution */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anticipated Scientific Contribution</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-serif">
                  {selectedGap.expected_contribution}
                </p>
              </div>

              {/* Supporting Literature References */}
              {selectedGap.source_paper_titles && selectedGap.source_paper_titles.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold block mb-2">Supporting Reviewed Papers:</span>
                  <div className="space-y-1.5">
                    {selectedGap.source_paper_titles.map((title, i) => (
                      <div key={i} className="flex items-center gap-2 text-indigo-300">
                        <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="line-clamp-1">{title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center academic-card text-xs text-slate-500">
              Select a research gap from the left to view the complete methodological proposal and experimental blueprint.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
