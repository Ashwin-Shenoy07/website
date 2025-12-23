// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import RegistrationForm from './components/RegistrationForm';
import PlayersList from './components/PlayerList';
import RegistrationClosed from './components/RegistrationClosed';
import TshirtRegistration from './components/TshirtRegistration';
// import AdminLogin from "./admin/AdminLogin";
// import AdminDashboard from "./admin/AdminDashboard";
// import AdminProtectedRoute from "./admin/AdminProtectedRoute";
// import AdminProvider from "./admin/AdminProvider";

import './App.css';
import logo from './asset/logo.png';

function PublicLayout() {
  const [activePage, setActivePage] = useState('players');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="app-with-menu">

      {/* TOP MENUBAR */}
      <header className="menubar">
        <div className="logo">
          <img src={logo} alt="CCL Logo" />
          <h1>CCL 2026</h1>
        </div>

        {/* Desktop Menu */}
        <nav className="desktop-menu">
          <button
            className={activePage === 'register_close' ? 'active' : ''}
            onClick={() => setActivePage('register_close')}
          >
            Register Player
          </button>
          <button
            className={activePage === 'players' ? 'active' : ''}
            onClick={() => setActivePage('players')}
          >
            View Players
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu">
            <button
              className={activePage === 'register_close' ? 'active' : ''}
              onClick={() => { setActivePage('register_close'); setMenuOpen(false); }}
            >
              Register Player
            </button>
            <button
              className={activePage === 'players' ? 'active' : ''}
              onClick={() => { setActivePage('players'); setMenuOpen(false); }}
            >
              View Players
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="main-content">
        {activePage === 'register' && <RegistrationForm />}
        {activePage === 'register_close' && <RegistrationClosed/>}
        {activePage === 'players' && <PlayersList />}
      </div>

    </div>
  );
}

function App() {
  
  return (
    <Router>
      <Routes>

        {/* PUBLIC SITE */}
        <Route path="/" element={<PublicLayout />} />
        <Route path="/tshirt" element={<TshirtRegistration />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/viewPlayers" element={<PlayersList />} />
        <Route path="/register_close" element={<RegistrationClosed />} />
        {/* <Route path="/admin/login" element={<AdminLogin />} />

        <Route
  path="/admin/dashboard"
  element={
    <AdminProtectedRoute>
      <AdminProvider>
        <AdminDashboard />
      </AdminProvider>
    </AdminProtectedRoute>
  }
/> */}

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
