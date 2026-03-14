import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import { getPath } from '../api';

 const NODE_COLORS = {
    Person: '#38bdf8',
    Skill: '#4ade80',
    JobRole: '#f472b6',
    Course: '#fb923c',
  };
function GraphView() {
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const jobId = localStorage.getItem('jobId');
  const userName = localStorage.getItem('userName');

 

  useEffect(() => {
    getPath(userId, jobId).then(res => {
      const data = res.data;

      const nodes = data.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        color: NODE_COLORS[item.type] || '#94a3b8',
      }));

      const links = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        links.push({
          source: nodes[i].id,
          target: nodes[i + 1].id,
        });
      }

      setGraphData({ nodes, links });
      setLoading(false);
    });
  }, [userId, jobId]);

  if (loading) {
    return (
      <div className="container">
        <h1>Building your graph...</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Your Learning Path Graph</h1>
      <h2>Visual path from {userName} to your dream job</h2>

      <div style={{
        background: '#1e293b',
        borderRadius: 12,
        border: '1px solid #334155',
        overflow: 'hidden',
        marginBottom: 24
      }}>
        <ForceGraph2D
          graphData={graphData}
          width={860}
          height={450}
          backgroundColor="#1e293b"
          nodeLabel="name"
          nodeColor={node => node.color}
          nodeRelSize={8}
          linkColor={() => '#475569'}
          linkWidth={2}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.fillStyle = '#e2e8f0';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, node.x, node.y + 16);
          }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ color: '#94a3b8', marginBottom: 12 }}>Node types:</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: color
              }} />
              <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ color: '#94a3b8', marginBottom: 12 }}>Nodes in your path:</p>
        {graphData.nodes.map((node, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8
          }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: node.color,
              flexShrink: 0
            }} />
            <span style={{ color: '#e2e8f0' }}>{node.name}</span>
            <span style={{ color: '#475569', fontSize: '0.8rem' }}>({node.type})</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => navigate('/courses')}>
          Back to Courses
        </button>
        <button
          className="btn"
          onClick={() => navigate('/')}
          style={{ background: '#1e293b', color: '#94a3b8' }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

export default GraphView;
