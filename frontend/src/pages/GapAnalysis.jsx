import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGap } from '../api';

function GapAnalysis() {
  const navigate = useNavigate();
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const jobId = localStorage.getItem('jobId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    getGap(userId, jobId).then(res => {
      setGaps(res.data);
      setLoading(false);
    });
  }, [userId, jobId]);

  if (loading) return (
    <div className="container"><h1>Analysing your skills...</h1></div>
  );

  return (
    <div className="container">
      <h1>Skill Gap Analysis</h1>
      <h2>Hey {userName}, here's what you need to learn</h2>

      {gaps.length === 0 ? (
        <div className="card">
          <p style={{ color: '#4ade80', fontSize: '1.2rem' }}>
            You already have all the skills for this role!
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: '#94a3b8', marginBottom: 20 }}>
            You are missing <strong style={{ color: '#f87171' }}>
            {gaps.length} skill{gaps.length > 1 ? 's' : ''}</strong> for this role
          </p>

          {gaps.map((gap, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#e2e8f0' }}>
                    {gap.missing_skill}
                  </p>
                  <p style={{ color: '#94a3b8', marginTop: 4 }}>
                    Category: {gap.category}
                  </p>
                </div>
                <span className={`tag ${gap.importance === 'Required' ? 'required' : 'preferred'}`}>
                  {gap.importance}
                </span>
              </div>
            </div>
          ))}
        </>
      )}

      <button className="btn" onClick={() => navigate('/courses')}>
        Show Me Courses →
      </button>

      <button className="btn"
        onClick={() => navigate('/graph')}
        style={{ marginLeft: 12, background: '#1e40af', color: '#bfdbfe' }}>
        View Graph Path →
      </button>
    </div>
  );
}

export default GapAnalysis;