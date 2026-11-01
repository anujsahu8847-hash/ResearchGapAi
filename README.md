# ResearchGap AI 🧠🔬

> **AI-Powered Academic Research Paper Discovery, Ingestion, Comparison, and Research-Gap Identification Platform**

---

## 📌 Project Overview
**ResearchGap AI** is designed to transform unstructured academic PDF documents into structured research intelligence. It integrates:
- **FastAPI + PyMuPDF (`fitz`)**: Robust parsing of academic sections (Abstract, Methodology, Experiments, Limitations, Future Work).
- **FAISS Vector Embeddings**: 384-dimensional dense semantic representations with sliding-window chunking (preserving page-level provenance).
- **Evidence-Grounded RAG Assistant**: Ask natural-language research questions with guaranteed page citations `[Paper Title, p. X]`. Seamlessly supports local **Ollama** models (`llama3`, `mistral`, `deepseek`) with a built-in deterministic academic grounded fallback.
- **Multi-Paper Methodology Comparison**: Side-by-side matrix across 11 key research parameters, algorithmic divergences, and shared foundations.
- **Interactive Research Knowledge Map**: Multi-relational graph connecting Papers, Topics, Problems, Methods, Algorithms, Datasets, and Gaps.
- **AI Research Gap & Opportunity Engine**: Cross-analyzes stated limitations and bottlenecks across studies to formulate novel candidate research directions and experimental designs.
- **System Evaluation Suite (Section 12)**: Live benchmark metrics calculating Recall@5, MRR@10, Precision@5, Retrieval Latency, Citation Support Rate, and Claim Groundedness.

---

## 🚀 Quick Start

### 1. Launch Backend & Frontend Concurrently
Double-click `start_all.bat` or run:
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive OpenAPI Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🗂️ Project Directory Structure

```
researchgap-ai/
├── backend/
│   ├── data/                   # SQLite database (researchgap.db)
│   ├── sample_papers/          # Pre-generated academic PDF benchmarks
│   ├── services/
│   │   ├── pdf_service.py      # PyMuPDF section extraction & text cleaning
│   │   ├── chunking_service.py # Sliding-window chunker with page provenance
│   │   ├── embedding_service.py# FAISS vector store & 384-d semantic encoder
│   │   ├── extraction_service.py# 11-parameter structured extraction engine
│   │   ├── comparison_service.py# Multi-paper comparative matrix
│   │   ├── graph_service.py    # Knowledge graph node/edge generator
│   │   ├── gap_service.py      # Cross-paper limitation & gap discovery
│   │   ├── discovery_service.py# Crossref & academic registry search
│   │   ├── rag_service.py      # Grounded RAG with citations & Ollama bridge
│   │   └── eval_service.py     # Section 12 evaluation metrics
│   ├── database.py             # SQLite schemas & connection manager
│   ├── main.py                 # FastAPI REST application
│   ├── seed_data.py            # Automated initial database seeder
│   └── create_sample_papers.py # Synthetic academic PDF generator
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header with status pills & actions
│   │   │   ├── Sidebar.jsx         # Section navigation with badges
│   │   │   ├── DashboardView.jsx   # 4.1 Overview & Recharts analytics
│   │   │   ├── DiscoverView.jsx    # 4.2 Paper search & 1-click import
│   │   │   ├── LibraryView.jsx     # 4.3 Catalog, search, CSV export
│   │   │   ├── UploadView.jsx      # 4.4 Multi-stage PDF ingestion
│   │   │   ├── ComparisonView.jsx  # 4.5 11-parameter comparison matrix
│   │   │   ├── KnowledgeMapView.jsx# 4.6 Interactive visual knowledge map
│   │   │   ├── RAGChatView.jsx     # 4.7 Evidence-grounded QA with citations
│   │   │   ├── ResearchGapsView.jsx# 4.8 Identified gaps & experiments
│   │   │   └── EvaluationView.jsx  # 12 Benchmark scorecards & query logs
│   │   ├── api.js              # REST client for FastAPI
│   │   ├── App.jsx             # Main application coordinator
│   │   ├── main.jsx            # React root
│   │   └── index.css           # Academic slate/indigo design system
│   ├── package.json
│   └── vite.config.js
├── run_backend.bat
├── run_frontend.bat
├── start_all.bat
└── README.md
```

---

## 💡 Key Modules & Features

### 1. Research Dashboard (4.1)
- Aggregated metrics: Processed papers, indexed vector chunks, library count, identified gaps.
- Visualizations: Research domain distribution (Recharts bar chart) and extracted algorithm frequencies.
- Recent research activities and recently ingested papers.

### 2. Discover Papers (4.2)
- Query across academic registries (CrossRef REST API & curated pre-indexed benchmarks).
- Filter by topic, year range, and keyword.
- 1-Click "Save to Library" button.

### 3. My Research Library (4.3)
- Full paper management: search, filter, view extracted parameters, inspect sliding-window vector chunks, and delete.
- One-click CSV export (`/api/papers/export/csv`).

### 4. PDF Upload & Ingestion (4.4)
- Drag-and-drop PDF uploader.
- Multi-stage real-time progress: Uploading $\rightarrow$ PyMuPDF Text Extraction $\rightarrow$ Section Parsing $\rightarrow$ Sliding-Window Chunking $\rightarrow$ FAISS Vector Embedding $\rightarrow$ Ready.
- Pre-bundled sample papers ready for instant ingestion.

### 5. Multi-Paper Methodology Comparison (4.5)
- Side-by-side comparative table across 11 parameters:
  *Research Problem, Objectives, Methodology, Algorithms, Datasets, Experimental Setup, Metrics, Results, Strengths, Limitations, Future Work*.
- Methodological similarities and algorithmic divergences.

### 6. Interactive Knowledge Graph (4.6)
- Visual topology connecting Papers, Topics, Problems, Methods, Algorithms, Datasets, and Gaps.
- Filter by entity type, interactive pan, zoom, and Node Inspector Drawer.

### 7. Ask Your Papers – Evidence-Grounded RAG (4.7)
- Conversational research assistant querying FAISS vector space.
- Every claim is tied to an explicit page-level citation `[Title, p. X]`.
- Interactive evidence drawer displaying raw retrieved text chunks and similarity scores.
- Seamless bridge with local Ollama (`llama3`) or built-in verified academic synthesis engine.

### 8. Research Gap Suggestions (4.8)
- Cross-paper limitation synthesis uncovering underexplored intersections.
- Generates candidate research directions with rationales, proposed architectures, experimental blueprints, and confidence scores.

### 9. System Evaluation & Benchmarks (12)
- Evaluates: Recall@5, MRR@10, Precision@5, Retrieval Latency, Citation Support Rate, and Groundedness.
