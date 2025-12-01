// frontend/src/components/PlayersList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerList.css';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    axios.get('https://website-k3qa.onrender.com/api/players/viewPlayers')
      .then(res => {
        console.log('res:', JSON.stringify(res));
        setPlayers(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to load players');
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="loading">Loading Players...</div>;

  return (
    <div className="players-container">
      <h2>All Registered Players ({players.length})</h2>

      <div className="players-grid">
        {players.map(player => {
          const isExpanded = expandedId === player._id;
          const regNo = `CCL2026-${String(player.regNumber || 0).padStart(3, '0')}`;

          return (
            <div
              key={player._id}
              className={`player-card ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleExpand(player._id)}
            >
              <div className="card-front">
                <img src={player.profilePhoto} alt={player.name} className="player-photo" />
                <div className="name-overlay">
                  <h3>{regNo}</h3>
                  <h4>{player.name}</h4>
                </div>
              </div>

              <div className="card-back">
                <div className="details">
                  <p><strong>Place:</strong> {player.place}</p>
                  <p><strong>Category:</strong> {player.category}</p>
                  <p><strong>Batting:</strong> {player.battingStyle}</p>
                  <p><strong>Bowling:</strong> {player.bowlingStyle || 'None'}</p>
                  <p><strong>Jersey:</strong> {player.nameOnJersey} #{player.numberOnJersey}</p>
                  <p><strong>Jersey Size:</strong> {player.jerseySize}</p>
                  <p><strong>Last Season:</strong> {player.playedLastSeason}</p>
                  <p className="click-hint">Click to collapse</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;