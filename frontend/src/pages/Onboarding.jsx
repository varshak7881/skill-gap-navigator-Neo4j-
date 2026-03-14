import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api';

const SKILLS = [
  { id: 'python', name: 'Python' },
  { id: 'ml', name: 'Machine Learning' },
  { id: 'sql', name: 'SQL' },
  { id: 'react', name: 'React' },
  { id: 'docker', name: 'Docker' },
];

function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name || !email || !title) {
      alert('Please fill in all fields!');
      return;
    }
    if (selected.length === 0) {
      alert('Please select at least one skill!');
      return;
    }

    setLoading(true);
    try {
      const userId = name.toLowerCase().replace(' ', '_') + '_' + Date.now();
      await createUser({
        id: userId,
        name,
        email,
        current_title: title,
        skills: selected
      });

      // Save to localStorage for use in other pages
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name);

      navigate('/jobs');
    } catch (err) {
      alert('Error creating user. Is the backend running?');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Skill Gap Navigator</h1>
      <h2>Let's build your career roadmap</h2>

      <div className="card">
        <p style={{ marginBottom: 16, color: '#94a3b8' }}>Your details</p>
        <input
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="Your current job title (e.g. Junior Dev)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="card">
        <p style={{ marginBottom: 12, color: '#94a3b8' }}>
          Select your current skills
        </p>
        {SKILLS.map(skill => (
          <span
            key={skill.id}
            className={`tag ${selected.includes(skill.id) ? 'selected' : ''}`}
            onClick={() => toggleSkill(skill.id)}
          >
            {skill.name}
          </span>
        ))}
      </div>

      <button
        className="btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Creating profile...' : 'Find My Dream Job →'}
      </button>
    </div>
  );
}

export default Onboarding;