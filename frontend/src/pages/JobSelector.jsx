import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../api';

function JobSelector() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs().then(res => {
      setJobs(res.data);
      setLoading(false);
    });
  }, []);

  const selectJob = (jobId) => {
    localStorage.setItem('jobId', jobId);
    navigate('/gap');
  };

  if (loading) return (
    <div className="container">
      <h1>Loading jobs...</h1>
    </div>
  );

  return (
    <div className="container">
      <h1>Pick Your Dream Job</h1>
      <h2>Select a role you want to work towards</h2>

      {jobs.map(job => (
        <div key={job.id} className="card" style={{ cursor: 'pointer' }}
          onClick={() => selectJob(job.id)}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#38bdf8' }}>
                {job.title}
              </p>
              <p style={{ color: '#94a3b8', marginTop: 4 }}>
                Level: {job.level}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1.1rem' }}>
                ${job.avg_salary?.toLocaleString()}
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>avg salary</p>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {job.skills?.map((s, i) => (
              <span key={i} className="tag">{s.name}</span>
            ))}
          </div>

          <button className="btn" style={{ marginTop: 12 }}>
            Select this role →
          </button>
        </div>
      ))}
    </div>
  );
}

export default JobSelector;