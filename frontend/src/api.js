const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) throw new Error("Failed to load dashboard metrics");
  return res.json();
}

export async function discoverPapers(query = "", topic = "", yearMin = null, yearMax = null) {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (topic && topic !== "all") params.append("topic", topic);
  if (yearMin) params.append("year_min", yearMin);
  if (yearMax) params.append("year_max", yearMax);
  const res = await fetch(`${API_BASE}/discover?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to search papers");
  return res.json();
}

export async function saveToLibrary(paperData) {
  const res = await fetch(`${API_BASE}/library/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paperData)
  });
  if (!res.ok) throw new Error("Failed to save paper to library");
  return res.json();
}

export async function fetchLibraryPapers(search = "", topic = "", year = null) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (topic && topic !== "all") params.append("topic", topic);
  if (year) params.append("year", year);
  const res = await fetch(`${API_BASE}/papers?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch library papers");
  return res.json();
}

export async function fetchPaperDetail(paperId) {
  const res = await fetch(`${API_BASE}/papers/${paperId}`);
  if (!res.ok) throw new Error("Failed to fetch paper detail");
  return res.json();
}

export async function deletePaper(paperId) {
  const res = await fetch(`${API_BASE}/papers/${paperId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete paper");
  return res.json();
}

export function getExportCSVUrl() {
  return `${API_BASE}/papers/export/csv`;
}

export async function uploadPDFFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function ingestSamplePaper(filename) {
  const res = await fetch(`${API_BASE}/ingest-sample/${filename}`, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to ingest ${filename}`);
  return res.json();
}

export async function ingestAllSamplePapers() {
  const res = await fetch(`${API_BASE}/ingest-all-samples`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to ingest sample papers");
  return res.json();
}

export async function comparePapers(paperIds) {
  const res = await fetch(`${API_BASE}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paper_ids: paperIds })
  });
  if (!res.ok) throw new Error("Failed to compare papers");
  return res.json();
}

export async function fetchKnowledgeGraph() {
  const res = await fetch(`${API_BASE}/knowledge-graph`);
  if (!res.ok) throw new Error("Failed to load knowledge graph");
  return res.json();
}

export async function askPapersRAG(query, paperId = null, topK = 5, ollamaModel = null) {
  const res = await fetch(`${API_BASE}/rag/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      paper_id: paperId ? parseInt(paperId) : null,
      top_k: topK,
      ollama_model: ollamaModel
    })
  });
  if (!res.ok) throw new Error("Failed to execute RAG query");
  return res.json();
}

export async function fetchOllamaStatus() {
  const res = await fetch(`${API_BASE}/rag/ollama-status`);
  if (!res.ok) return { available: false, models: [], current_model: "Built-in" };
  return res.json();
}

export async function fetchResearchGaps() {
  const res = await fetch(`${API_BASE}/gaps`);
  if (!res.ok) throw new Error("Failed to generate research gaps");
  return res.json();
}

export async function runEvaluation() {
  const res = await fetch(`${API_BASE}/evaluation/run`);
  if (!res.ok) throw new Error("Failed to run evaluation suite");
  return res.json();
}
