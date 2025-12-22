// frontend/src/App.js
import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import PlayersList from './components/PlayerList';
import './App.css';
import logo from './asset/logo.png';
import RegistrationClosed from './components/RegistrationClosed';
import TshirtRegistration from './components/TshirtRegistration';

function App() {
  const [activePage, setActivePage] = useState('players');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-with-menu">

      {/* TOP MENUBAR */}
      <header className="menubar">
        <div className="logo">
          <img src={logo}/>
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
      {/* BREADCRUMB */}

      {/* Mobile Menu Overlay */}
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
        {activePage === 'register_close' && <RegistrationClosed />}
        {activePage === 'players' && <PlayersList />}

        {activePage === 'tshirt' && <TshirtRegistration />}
      </div>
    </div>
  );
}

export default App;