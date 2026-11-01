import React, { useState } from 'react';
import {
  FileUp,
  FileCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { uploadPDFFile, ingestSamplePaper, ingestAllSamplePapers } from '../api';

const SAMPLE_PAPERS_LIST = [
  {
    filename: "paper_transformers_sparse.pdf",
    title: "Attention Is All You Need: Limitations and Sparse Long-Context Extensions",
    domain: "Natural Language Processing"
  },
  {
    filename: "paper_federated_healthcare.pdf",
    title: "Federated Learning on Heterogeneous Clinical Data: Non-IID Skew & Privacy",
    domain: "Healthcare & Biomedical AI"
  },
  {
    filename: "paper_gnn_drug_discovery.pdf",
    title: "Equivariant Graph Neural Networks: Over-Smoothing Bottlenecks in Molecular AI",
    domain: "Bioinformatics & Chemistry"
  }
];

export default function UploadView({ onPaperUploaded }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [ingestingSample, setIngestingSample] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Only academic PDF documents (.pdf) are supported.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Only academic PDF documents (.pdf) are supported.');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);
    setUploadResult(null);

    try {
      setProcessStage('1/4: Ingesting file & validating format...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessStage('2/4: PyMuPDF section parsing & text extraction...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessStage('3/4: Sliding-window chunking & FAISS 384-d vector embedding...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessStage('4/4: Extracting structured methodology, results, and research gaps...');
      const res = await uploadPDFFile(selectedFile);

      setUploadResult(res);
      setSelectedFile(null);
      if (onPaperUploaded) onPaperUploaded();
    } catch (err) {
      setError(err.message || 'PDF processing failed');
    } finally {
      setIsProcessing(false);
      setProcessStage('');
    }
  };

  const handleIngestSample = async (filename) => {
    setIngestingSample(filename);
    try {
      await ingestSamplePaper(filename);
      if (onPaperUploaded) onPaperUploaded();
      alert(`Successfully ingested '${filename}'!`);
    } catch (err) {
      alert(`Ingest failed: ${err.message}`);
    } finally {
      setIngestingSample(null);
    }
  };

  const handleIngestAll = async () => {
    setIngestingSample('all');
    try {
      await ingestAllSamplePapers();
      if (onPaperUploaded) onPaperUploaded();
      alert('All sample research papers ingested and indexed successfully!');
    } catch (err) {
      alert(`Ingest failed: ${err.message}`);
    } finally {
      setIngestingSample(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">PDF Upload & Academic Ingestion</h2>
        <p className="text-xs text-slate-400 mt-1">
          Automated multi-stage extraction pipeline: PyMuPDF text parsing, section boundary detection, sliding-window chunking, 384-d FAISS embedding, and structured parameter extraction.
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`academic-card p-10 border-2 border-dashed text-center transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <FileUp className="w-8 h-8" />
        </div>

        <h3 className="font-semibold text-white text-base mb-1">
          {selectedFile ? selectedFile.name : 'Drag & Drop Academic PDF Papers Here'}
        </h3>
        <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
          {selectedFile
            ? `File size: ${(selectedFile.size / 1024).toFixed(1)} KB`
            : 'Supports peer-reviewed papers, arXiv preprints, thesis chapters, and conference proceedings.'}
        </p>

        <input
          type="file"
          id="pdf-upload-input"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center justify-center gap-3">
          <label
            htmlFor="pdf-upload-input"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition"
          >
            Browse Files
          </label>
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={isProcessing}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start AI Ingestion</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* In-Flight Pipeline Stages */}
      {isProcessing && (
        <div className="academic-card p-5 space-y-3 bg-indigo-950/30 border-indigo-500/30">
          <div className="flex items-center gap-3">
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            <span className="text-xs font-semibold text-indigo-200">{processStage}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification */}
      {uploadResult && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{uploadResult.message}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
            ID #{uploadResult.paper_id}
          </span>
        </div>
      )}

      {/* Sample Papers Library Ingestion Section */}
      <div className="academic-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white text-sm">Pre-Bundled Academic Benchmark Papers</h3>
            <p className="text-xs text-slate-400">Instantly test the platform without uploading your own PDF files.</p>
          </div>
          <button
            onClick={handleIngestAll}
            disabled={ingestingSample === 'all'}
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{ingestingSample === 'all' ? 'Ingesting All...' : 'Ingest All (3 Papers)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_PAPERS_LIST.map((sp) => (
            <div key={sp.filename} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2 flex flex-col justify-between">
              <div>
                <span className="tag-pill tag-topic text-[10px] mb-2">{sp.domain}</span>
                <h4 className="font-semibold text-xs text-slate-200 line-clamp-2">{sp.title}</h4>
              </div>
              <button
                onClick={() => handleIngestSample(sp.filename)}
                disabled={ingestingSample === sp.filename}
                className="w-full mt-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition disabled:opacity-50"
              >
                {ingestingSample === sp.filename ? 'Ingesting...' : 'Ingest This Paper'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
