import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './PlayerList.css';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backendURL}api/players/viewPlayers`)
      .then(res => {
        setPlayers(res.data);
        setFilteredPlayers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [backendURL]);

  // Real-time search
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = players.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.mobile.includes(searchTerm)
    );
    setFilteredPlayers(result);
  }, [searchTerm, players]);

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  if (loading) return <div className="loader">Loading Players...<div class="loader-striped"></div></div>;

  return (
    <div className="players-grid-container">

      {/* HEADING + SEARCH IN SAME ROW */}
      <div className="header-with-search">
        <h2>All Registered Players ({filteredPlayers.length})</h2>

        {/* Desktop Search */}
        <div className="desktop-search">
          <input
            type="text"
            placeholder="Search by Name or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon-clean"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
        </div>

        {/* Mobile Search Toggle */}
        <button 
          className="mobile-search-toggle"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        >
          <FontAwesomeIcon 
          icon={showMobileSearch ? faXmark : faMagnifyingGlass}/>
        </button>
      </div>

      {/* Mobile Search Input (Slides Down) */}
      {showMobileSearch && (
        <div className="mobile-search-input">
          <input
            type="text"
            placeholder="Search by Name or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      )}

      {/* YOUR GRID — UNCHANGED */}
      <div className="players-grid">
        {filteredPlayers.map(player => {
          const isOpen = expandedId === player._id;
          const regNo = player.regNumber 
            ? `${String(player.regNumber).padStart(3, '0')}` 
            : '—';

          return (
            <div
              key={player._id}
              className={`player-grid-card ${isOpen ? 'expanded' : ''}`}
              onClick={() => toggle(player._id)}
            >
              <div className="compact-view">
                <img src={player.profilePhoto} alt={player.name} className="profile-pic" />
                <div className="info">
                  <h3>{player.name}</h3>
                  <p className="reg-no">{regNo}</p>
                  <p className="place">{player.place}</p>
                </div>
                <span className="expand-icon">{isOpen ? '−' : '+'}</span>
              </div>

              {isOpen && (
                <div className="expanded-details">
                  <div className="detail"><span>Category:</span> {player.category}</div>
                  <div className="detail"><span>Batting:</span> {player.battingStyle}</div>
                  <div className="detail"><span>Bowling:</span> {player.bowlingStyle || 'None'}</div>
                  <div className="detail"><span>Jersey Name:</span> {player.nameOnJersey || player.name}</div>
                  <div className="detail"><span>Jersey No:</span> #{player.numberOnJersey}</div>
                  <div className="detail"><span>Size:</span> {player.jerseySize}</div>
                  <div className="detail"><span>Last Season:</span> {player.playedLastSeason}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayersList;