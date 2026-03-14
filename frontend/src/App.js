import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import JobSelector from './pages/JobSelector';
import GapAnalysis from './pages/GapAnalysis';
import Courses from './pages/Courses';
import GraphView from './pages/GraphView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/jobs" element={<JobSelector />} />
        <Route path="/gap" element={<GapAnalysis />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/graph" element={<GraphView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;