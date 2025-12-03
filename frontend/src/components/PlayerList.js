import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerList.css';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendURL = process.env.REACT_APP_BACKEND_URL; 
  useEffect(() => {
    axios.get(`${backendURL}api/players/viewPlayers`)
      .then(res => {
        setPlayers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

const toggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="loading">Loading Players...</div>;

  return (
    <div className="players-grid-container">
      

      <div className="players-grid">
        {players.map(player => {
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
              {/* Compact View */}
              <div className="compact-view">
                <img src={player.profilePhoto} alt={player.name} className="profile-pic" />
                <div className="info">
                  <h3>{player.name}</h3>
                  <p className="reg-no">{regNo}</p>
                  <p className="place">{player.place}</p>
                </div>
                <span className="expand-icon">{isOpen ? '−' : '+'}</span>
              </div>

              {/* Expanded Details */}
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

// design 2
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './PlayerList.css';

// const PlayersList = () => {
//   const [players, setPlayers] = useState([]);
//   const [expandedId, setExpandedId] = useState(null); // ← Fixed name
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('https://website-k3qa.onrender.com/api/players/viewPlayers')
//       .then(res => {
//         setPlayers(res.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   const toggle = (id) => {
//     setExpandedId(prev => prev === id ? null : id); // ← Now correct
//   };

//   if (loading) return <div className="loader">Loading Players...</div>;

//   return (
//     <div className="players-page">

//       <div className="players-list-vertical">
//         {players.map(player => {
//           const isOpen = expandedId === player._id; // ← Now matches state name
//           const reg = player.regNumber ? String(player.regNumber).padStart(3, '0') : '000';

//           return (
//             <div
//               key={player._id}
//               className={`player-item ${isOpen ? 'open' : ''}`}
//               onClick={() => toggle(player._id)}
//             >
//               {/* Header Row */}
//               <div className="player-header">
//                 <img src={player.profilePhoto} alt={player.name} className="avatar" />
                
//                 <div className="player-main-info">
//                   <h3>{player.name}</h3>
//                   <div className="sub-info">
//                     <span className="reg-id">{reg}</span>
//                     <span className="location">{player.place}</span>
//                   </div>
//                 </div>

//                 <div className={`arrow ${isOpen ? 'down' : 'right'}`}></div>
//               </div>

//               {/* Expanded Details */}
//               {isOpen && (
//                 <div className="player-details">
//                   <div className="detail-grid">
//                     <div className="detail-item">
//                       <span className="label">Category</span>
//                       <span className="value">{player.category}</span>
//                     </div>
//                     <div className="detail-item">
//                       <span className="label">Batting Style</span>
//                       <span className="value">{player.battingStyle}</span>
//                     </div>
//                     <div className="detail-item">
//                       <span className="label">Bowling Style</span>
//                       <span className="value">{player.bowlingStyle || '—'}</span>
//                     </div>
//                     <div className="detail-item">
//                       <span className="label">Jersey Name</span>
//                       <span className="value">{player.nameOnJersey || player.name}</span>
//                     </div>
//                     <div className="detail-item">
//                       <span className="label">Jersey No.</span>
//                       <span className="value">#{player.numberOnJersey}</span>
//                     </div>
//                     <div className="detail-item">
//                       <span className="label">Jersey Size</span>
//                       <span className="value">{player.jerseySize}</span>
//                     </div>
//                     <div className="detail-item">
//                       <span className="label">Last Season</span>
//                       <span className="value">{player.playedLastSeason}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default PlayersList;