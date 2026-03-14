import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../api';

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const jobId = localStorage.getItem('jobId');

  useEffect(() => {
    getCourses(userId, jobId).then(res => {
      setCourses(res.data);
      setLoading(false);
    });
  }, [userId, jobId]);

  if (loading) {
    return (
      <div className="container">
        <h1>Finding best courses...</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Recommended Courses</h1>
      <h2>These courses cover your missing skills</h2>

      {courses.length === 0 ? (
        <div className="card">
          <p style={{ color: '#4ade80' }}>
            No courses needed - you have all the skills!
          </p>
        </div>
      ) : (
        courses.map((course, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8' }}>
                  {course.course}
                </p>
                <p style={{ color: '#94a3b8', marginTop: 4 }}>
                  Platform: {course.platform}
                </p>
                <p style={{ color: '#94a3b8', marginTop: 4 }}>
                  Duration: {course.duration_hours} hours
                </p>
                <div style={{ marginTop: 10 }}>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 6 }}>
                    Skills covered:
                  </p>
                  {course.skills_covered && course.skills_covered.map((skill, j) => (
                    <span key={j} className="tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right', marginLeft: 16 }}>
                <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  ${course.price}
                </p>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: 8,
                    color: '#38bdf8',
                    fontSize: '0.85rem',
                    textDecoration: 'underline'
                  }}
                >
                  View Course
                </a>
              </div>
            </div>
          </div>
        ))
      )}

      <div style={{ marginTop: 20 }}>
        <button className="btn" onClick={() => navigate('/graph')}>
          View My Graph Path
        </button>
        <button
          className="btn"
          onClick={() => navigate('/gap')}
          style={{ marginLeft: 12, background: '#1e293b', color: '#94a3b8' }}
        >
          Back to Gap Analysis
        </button>
      </div>
    </div>
  );
}

export default Courses;
