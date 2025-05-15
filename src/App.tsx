import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PointsTablePage from './pages/PointsTablePage';
import SchedulePage from './pages/SchedulePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/points-table" element={<PointsTablePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} IPL T20 Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;