import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Play,
  RotateCcw,
  Zap,
  ShieldCheck,
  Target,
  Clock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { runEvaluation } from '../api';

export default function EvaluationView() {
  const [evalResult, setEvalResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    executeEvaluation();
  }, []);

  const executeEvaluation = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const data = await runEvaluation();
      setEvalResult(data);
    } catch (err) {
      setError(err.message || 'Evaluation run failed');
    } finally {
      setIsRunning(false);
    }
  };

  const m = evalResult?.metrics || {};

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">System Evaluation & Transparency Suite</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
              Section 12 Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantitative assessment of semantic retrieval density, MRR, latency, citation support rate, and claim groundedness.
          </p>
        </div>
        <button
          onClick={executeEvaluation}
          disabled={isRunning}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition"
        >
          {isRunning ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Running Benchmarks...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Run Live Benchmark</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Metric Scorecards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recall@5 */}
        <div className="academic-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recall@5</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">
            {m.recall_at_5 !== undefined ? (m.recall_at_5 * 100).toFixed(1) + '%' : '--'}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Proportion of relevant document sections retrieved in top 5 candidates.
          </p>
        </div>

        {/* MRR@10 */}
        <div className="academic-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">MRR@10</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">
            {m.mrr_at_10 !== undefined ? m.mrr_at_10.toFixed(2) : '--'}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Mean Reciprocal Rank measuring position of the first relevant chunk.
          </p>
        </div>

        {/* Precision@5 */}
        <div className="academic-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Precision@5</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">
            {m.precision_at_5 !== undefined ? (m.precision_at_5 * 100).toFixed(1) + '%' : '--'}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Density of highly relevant academic evidence in retrieved window.
          </p>
        </div>

        {/* Retrieval Latency */}
        <div className="academic-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Latency</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono">
            {m.avg_retrieval_latency_ms !== undefined ? `${m.avg_retrieval_latency_ms} ms` : '--'}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            End-to-end FAISS vector search and similarity scoring time.
          </p>
        </div>

        {/* Citation Support Rate */}
        <div className="academic-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Citation Support</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">
            {m.citation_support_rate !== undefined ? `${m.citation_support_rate}%` : '--'}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Percentage of generated statements tied to verifiable page numbers.
          </p>
        </div>

        {/* Groundedness */}
        <div className="academic-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Groundedness</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono">
            {m.groundedness_score !== undefined ? `${m.groundedness_score}%` : '--'}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Absence of external hallucination; strict consistency with indexed chunks.
          </p>
        </div>
      </div>

      {/* Benchmark Query Logs Table */}
      {evalResult?.query_evaluations && (
        <div className="academic-card overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">Automated Test Query Execution Logs</h3>
            <span className="text-xs text-slate-400">
              {evalResult.query_evaluations.length} Test Cases Evaluated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Test Query</th>
                  <th className="p-3 font-semibold">Target Provenance</th>
                  <th className="p-3 font-semibold">Latency</th>
                  <th className="p-3 font-semibold">Precision</th>
                  <th className="p-3 font-semibold">MRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {evalResult.query_evaluations.map((qe, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-3 font-medium text-slate-200">{qe.query}</td>
                    <td className="p-3 text-slate-400">
                      <div className="flex flex-wrap gap-1">
                        {qe.target_sections.map((sec, si) => (
                          <span key={si} className="tag-pill tag-topic text-[10px]">{sec}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-emerald-400">{qe.latency_ms} ms</td>
                    <td className="p-3 font-mono text-slate-200">{(qe.precision * 100).toFixed(0)}%</td>
                    <td className="p-3 font-mono text-indigo-300">{qe.mrr.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
