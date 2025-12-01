// frontend/src/App.js
import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import PlayerList from './components/PlayerList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <div className="App">
      {/* Banner */}
      <div className="banner-container">
        <img src="/banner.png" alt="CCL 2026" className="banner" />
        <div className="overlay">
          <h1>CCL 2026</h1>
          <p>Official Player Registration Portal</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'register' ? 'active' : ''}
          onClick={() => setActiveTab('register')}
        >
          Register Player
        </button>
        <button
          className={activeTab === 'view' ? 'active' : ''}
          onClick={() => setActiveTab('view')}
        >
          View All Players ({/* Optional: live count */})
        </button>
      </div>

      {/* Content */}
      <div className="tab-content">
        {activeTab === 'register' && <RegistrationForm />}
        {activeTab === 'view' && <PlayerList />}
      </div>
    </div>
  );
}

export default App;