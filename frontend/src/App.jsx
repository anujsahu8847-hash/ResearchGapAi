import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import DiscoverView from './components/DiscoverView';
import LibraryView from './components/LibraryView';
import UploadView from './components/UploadView';
import ComparisonView from './components/ComparisonView';
import KnowledgeMapView from './components/KnowledgeMapView';
import RAGChatView from './components/RAGChatView';
import ResearchGapsView from './components/ResearchGapsView';
import EvaluationView from './components/EvaluationView';
import { fetchDashboard, fetchOllamaStatus, ingestAllSamplePapers } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ragInitialPaperId, setRagInitialPaperId] = useState(null);

  const loadInitialData = async () => {
    try {
      const [dash, oStatus] = await Promise.all([
        fetchDashboard(),
        fetchOllamaStatus()
      ]);
      setDashboardData(dash);
      setOllamaStatus(oStatus);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleQuickIngest = async () => {
    setIsIngesting(true);
    try {
      await ingestAllSamplePapers();
      await loadInitialData();
      alert('Sample academic papers ingested and indexed successfully!');
    } catch (err) {
      alert(`Ingest failed: ${err.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleSelectPaperForRAG = (paperId) => {
    setRagInitialPaperId(paperId);
    setActiveTab('rag_chat');
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        ollamaStatus={ollamaStatus}
        stats={dashboardData}
        onQuickIngest={handleQuickIngest}
        isIngesting={isIngesting}
      />

      {/* Main Workspace: Pinned Sidebar + Scrollable View Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          papersCount={dashboardData?.uploaded_papers_count ?? 0}
          gapsCount={3}
        />

        <main className="flex-1 overflow-y-auto min-h-0 p-6 md:p-8 bg-slate-900/40">
          <div className="max-w-7xl mx-auto pb-16">
            {activeTab === 'dashboard' && (
              <DashboardView
                dashboardData={dashboardData}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'discover' && (
              <DiscoverView onPaperSaved={loadInitialData} />
            )}
            {activeTab === 'library' && (
              <LibraryView
                onSelectPaperForRAG={handleSelectPaperForRAG}
                onSelectPaperForComparison={() => setActiveTab('compare')}
              />
            )}
            {activeTab === 'upload' && (
              <UploadView onPaperUploaded={loadInitialData} />
            )}
            {activeTab === 'compare' && <ComparisonView />}
            {activeTab === 'knowledge_map' && <KnowledgeMapView />}
            {activeTab === 'rag_chat' && (
              <RAGChatView initialPaperId={ragInitialPaperId} />
            )}
            {activeTab === 'gaps' && <ResearchGapsView />}
            {activeTab === 'evaluation' && <EvaluationView />}
          </div>
        </main>
      </div>
    </div>
  );
}
