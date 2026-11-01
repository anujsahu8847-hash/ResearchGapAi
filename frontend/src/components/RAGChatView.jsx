import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  FileText,
  CheckCircle,
  AlertCircle,
  Layers,
  ChevronDown,
  Quote,
  Loader2,
  Cpu
} from 'lucide-react';
import { askPapersRAG, fetchLibraryPapers, fetchOllamaStatus } from '../api';

const PRESET_QUESTIONS = [
  "What is the main limitation of standard full-rank attention mechanisms?",
  "Which algorithm and privacy mechanisms are proposed for clinical data?",
  "How does EGNN-Res mitigate graph over-smoothing in drug discovery?",
  "What datasets and experimental benchmarks were evaluated across the papers?",
  "What future work and novel architectures have been suggested?"
];

export default function RAGChatView({ initialPaperId }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your **ResearchGap AI Assistant**. I can answer deep research questions grounded strictly in your uploaded and indexed academic literature. Every claim is substantiated by verified page-level citations.",
      citations: [],
      groundedness_score: 1.0,
      engine: 'ResearchGap Verified RAG Engine'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedPaperId, setSelectedPaperId] = useState(initialPaperId || 'all');
  const [libraryPapers, setLibraryPapers] = useState([]);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [papersData, oStatus] = await Promise.all([
        fetchLibraryPapers(),
        fetchOllamaStatus()
      ]);
      setLibraryPapers(papersData.papers || []);
      setOllamaStatus(oStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryToSend = null) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: q
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const paperFilter = selectedPaperId === 'all' ? null : parseInt(selectedPaperId);
      const res = await askPapersRAG(q, paperFilter, 5, ollamaStatus?.current_model);

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.answer,
        citations: res.citations || [],
        groundedness_score: res.groundedness_score,
        engine: res.engine,
        insufficient_evidence: res.insufficient_evidence
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `Error retrieving answer: ${err.message}. Please check if papers are indexed.`,
        citations: []
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      {/* Top Header & Context Scope Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Ask Your Papers</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold font-mono">
              Evidence-Grounded RAG
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Retrieve answers backed by exact page references <code className="text-indigo-300 font-mono">[Title, p. X]</code>.
          </p>
        </div>

        {/* Paper Scope Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Search Scope:</span>
          <select
            value={selectedPaperId}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 max-w-xs truncate"
          >
            <option value="all">All Indexed Papers ({libraryPapers.length})</option>
            {libraryPapers.map((p) => (
              <option key={p.id} value={p.id}>
                Paper #{p.id}: {p.title.slice(0, 45)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Questions Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" /> Prompts:
        </span>
        {PRESET_QUESTIONS.map((pq, i) => (
          <button
            key={i}
            onClick={() => handleSend(pq)}
            className="text-[11px] px-3 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/20 hover:text-indigo-200 text-slate-300 border border-slate-700/60 whitespace-nowrap transition"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 academic-card p-6 overflow-y-auto space-y-6 rounded-2xl bg-slate-900/60 border-slate-800">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex gap-4 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  isBot
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`space-y-3 max-w-[85%] ${
                  isBot
                    ? 'p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200'
                    : 'p-4 rounded-2xl bg-indigo-600 text-white shadow-md'
                }`}
              >
                {/* Text Content */}
                <div className="text-xs leading-relaxed font-sans whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Grounded Citations & Evidence Pill Box */}
                {isBot && msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1.5 text-indigo-300">
                        <Quote className="w-3.5 h-3.5" /> Verified Citations ({msg.citations.length})
                      </span>
                      {msg.groundedness_score && (
                        <span className="text-emerald-400 font-mono text-[10px]">
                          Groundedness: {(msg.groundedness_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => setActiveEvidenceModal(cite)}
                          className="citation-chip"
                          title="Click to view exact source excerpt & relevance score"
                        >
                          <span>{cite.tag}</span>
                          <span className="ml-1 text-[10px] text-indigo-400 font-mono">
                            ({cite.similarity_score})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Engine Info */}
                {isBot && msg.engine && (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                    <Cpu className="w-3 h-3 text-slate-400" />
                    <span>Engine: {msg.engine}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3 text-xs text-indigo-300">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Retrieving relevant chunks & synthesizing grounded academic answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question about algorithms, results, limitations, or future directions..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>

      {/* Evidence Excerpt Drawer / Modal */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="tag-pill tag-paper text-[10px] mb-1 block w-fit">
                  Provenance Page {activeEvidenceModal.page_number}
                </span>
                <h3 className="font-bold text-white text-sm">{activeEvidenceModal.paper_title}</h3>
                <span className="tag-pill tag-topic text-[10px] mt-1">
                  Section: {activeEvidenceModal.section_name}
                </span>
              </div>
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
              "{activeEvidenceModal.excerpt}"
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Cosine Similarity: <strong className="text-emerald-400">{activeEvidenceModal.similarity_score}</strong></span>
              <span>Citation Tag: <code className="text-indigo-300">{activeEvidenceModal.tag}</code></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
