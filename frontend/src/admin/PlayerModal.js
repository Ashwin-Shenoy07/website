import { useEffect, useState } from "react";
import axios from "axios";
import "./PlayerModal.css";

const PlayerModal = ({ playerId, onClose }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}api/admin/players/${playerId}`,
        { withCredentials: true }
      )
      .then(res => setPlayer(res.data));
  }, [playerId]);

  if (!player) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>×</button>

        <h3>{player.name}</h3>

        <div className="modal-grid">
          <p><b>Reg No:</b> {player.regNumber}</p>
          <p><b>Mobile:</b> {player.mobile}</p>
          <p><b>Place:</b> {player.place}</p>
          <p><b>DOB:</b> {new Date(player.dob).toLocaleDateString()}</p>
          <p><b>Category:</b> {player.category}</p>
          <p><b>Batting:</b> {player.battingStyle}</p>
          <p><b>Bowling:</b> {player.bowlingStyle}</p>
          <p><b>Jersey:</b> {player.jerseySize}</p>
          <p><b>Played Last Season:</b> {player.playedLastSeason}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
