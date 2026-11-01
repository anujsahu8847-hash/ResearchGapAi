import React, { useState, useEffect, useRef } from 'react';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Info,
  X,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { fetchKnowledgeGraph } from '../api';

export default function KnowledgeMapView() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [], color_map: {} });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const data = await fetchKnowledgeGraph();
      // Assign initial 2D circular/force layout coordinates to nodes
      const total = data.nodes.length;
      const radius = 280;
      const nodesWithCoords = data.nodes.map((node, i) => {
        const angle = (i / total) * 2 * Math.PI;
        // Jitter by type
        let dist = radius;
        if (node.type === 'paper') dist = radius * 0.55;
        if (node.type === 'topic') dist = radius * 0.25;
        if (node.type === 'gap') dist = radius * 1.15;
        if (node.type === 'algorithm') dist = radius * 0.85;

        return {
          ...node,
          x: 450 + dist * Math.cos(angle),
          y: 350 + dist * Math.sin(angle)
        };
      });

      setGraphData({
        ...data,
        nodes: nodesWithCoords
      });
      if (nodesWithCoords.length > 0) {
        setSelectedNode(nodesWithCoords[0]);
      }
    } catch (err) {
      console.error('Failed to load knowledge graph:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'graph-canvas') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const filteredNodes = filterType === 'all'
    ? graphData.nodes
    : graphData.nodes.filter((n) => n.type === filterType);

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

  const filteredEdges = graphData.edges.filter(
    (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  );

  // Find connected edges and neighbors for selected node
  const connectedEdges = selectedNode
    ? graphData.edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  const neighborNodeIds = new Set();
  connectedEdges.forEach((e) => {
    neighborNodeIds.add(e.source);
    neighborNodeIds.add(e.target);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Research Knowledge Map</h2>
          <p className="text-xs text-slate-400 mt-1">
            Interactive semantic topology linking papers, methodologies, algorithms, benchmark datasets, and research gaps.
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs"
            title="Reset Pan & Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter by Node Type */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" /> Filter Nodes:
        </span>
        {['all', 'paper', 'topic', 'method', 'algorithm', 'dataset', 'problem', 'gap'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize transition ${
              filterType === t
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Canvas & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Graph Canvas */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="lg:col-span-3 academic-card h-[580px] relative overflow-hidden bg-slate-950/70 cursor-grab active:cursor-grabbing border border-slate-800 rounded-xl"
        >
          <svg
            id="graph-canvas"
            className="w-full h-full"
            viewBox="0 0 900 700"
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#818CF8" />
              </marker>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {filteredEdges.map((e) => {
                const sourceNode = graphData.nodes.find((n) => n.id === e.source);
                const targetNode = graphData.nodes.find((n) => n.id === e.target);
                if (!sourceNode || !targetNode) return null;

                const isConnectedToSelected =
                  selectedNode && (e.source === selectedNode.id || e.target === selectedNode.id);

                return (
                  <g key={e.id}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isConnectedToSelected ? '#818CF8' : '#334155'}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.2}
                      strokeDasharray={e.relationship === 'identifies_limitation' ? '4 2' : undefined}
                      markerEnd={isConnectedToSelected ? 'url(#arrow-active)' : 'url(#arrow)'}
                      opacity={selectedNode && !isConnectedToSelected ? 0.25 : 0.85}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode && selectedNode.id === node.id;
                const isNeighbor = neighborNodeIds.has(node.id);
                const color = node.color || '#3B82F6';

                let nodeRadius = 16;
                if (node.type === 'paper') nodeRadius = 22;
                if (node.type === 'gap') nodeRadius = 20;
                if (node.type === 'topic') nodeRadius = 18;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-transform duration-150"
                  >
                    {/* Pulsing ring for selected node */}
                    {isSelected && (
                      <circle
                        r={nodeRadius + 8}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        className="animate-ping opacity-50"
                      />
                    )}

                    <circle
                      r={nodeRadius}
                      fill={color}
                      fillOpacity={isSelected ? 1 : 0.85}
                      stroke={isSelected ? '#FFFFFF' : '#1E293B'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      opacity={selectedNode && !isSelected && !isNeighbor ? 0.35 : 1}
                    />

                    <text
                      dy={nodeRadius + 14}
                      textAnchor="middle"
                      fill="#E2E8F0"
                      fontSize="10"
                      fontFamily="Inter, sans-serif"
                      fontWeight={isSelected ? '700' : '500'}
                      opacity={selectedNode && !isSelected && !isNeighbor ? 0.3 : 0.9}
                      className="pointer-events-none drop-shadow"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Canvas Floating Legend */}
          <div className="absolute bottom-3 left-3 glass-panel p-2.5 rounded-lg flex flex-wrap gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-blue-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Paper</span>
            <span className="flex items-center gap-1 text-purple-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Topic</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Method</span>
            <span className="flex items-center gap-1 text-amber-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Algorithm</span>
            <span className="flex items-center gap-1 text-cyan-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Dataset</span>
            <span className="flex items-center gap-1 text-pink-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Gap</span>
          </div>
        </div>

        {/* Node Inspector Drawer */}
        <div className="academic-card p-5 space-y-4 h-[580px] overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <span className={`tag-pill tag-${selectedNode.type} uppercase text-[10px] tracking-wider mb-2`}>
                  {selectedNode.type} Node
                </span>
                <h3 className="font-bold text-white text-sm leading-snug">
                  {selectedNode.full_label || selectedNode.label}
                </h3>
              </div>

              {/* Node Metadata */}
              {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 && (
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs">
                  <h4 className="font-semibold text-slate-300 text-[11px] mb-1">Entity Details</h4>
                  {selectedNode.metadata.year && (
                    <div className="text-slate-400">Year: <strong className="text-slate-200">{selectedNode.metadata.year}</strong></div>
                  )}
                  {selectedNode.metadata.topic && (
                    <div className="text-slate-400">Domain: <strong className="text-slate-200">{selectedNode.metadata.topic}</strong></div>
                  )}
                  {selectedNode.metadata.description && (
                    <div className="text-slate-300 font-serif leading-relaxed text-[11px] mt-1">{selectedNode.metadata.description}</div>
                  )}
                </div>
              )}

              {/* Connected Relationships */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-300 text-xs flex items-center justify-between">
                  <span>Connected Relationships</span>
                  <span className="text-[10px] text-indigo-400 font-mono">({connectedEdges.length})</span>
                </h4>
                <div className="space-y-1.5">
                  {connectedEdges.map((e) => {
                    const isTarget = e.source === selectedNode.id;
                    const otherNodeId = isTarget ? e.target : e.source;
                    const otherNode = graphData.nodes.find((n) => n.id === otherNodeId);
                    if (!otherNode) return null;

                    return (
                      <div
                        key={e.id}
                        onClick={() => setSelectedNode(otherNode)}
                        className="p-2 rounded bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 text-[11px] cursor-pointer transition flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
                            {e.label}
                          </span>
                          <span className="text-slate-200 font-medium line-clamp-1">{otherNode.label}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              <Info className="w-6 h-6 mx-auto mb-2 text-slate-600" />
              <p>Click any node on the graph to inspect relationships and academic properties.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
