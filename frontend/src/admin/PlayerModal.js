import { useEffect, useState } from "react";
import axios from "axios";

const PlayerModal = ({ playerId, onClose }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/admin/players/${playerId}`, {
      withCredentials: true
    }).then(res => setPlayer(res.data));
  }, [playerId]);

  if (!player) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 w-96 rounded relative">
        <button
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          ✖
        </button>

        <img
          src={player.photo}
          alt={player.name}
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />

        <h3 className="text-xl font-bold text-center">{player.name}</h3>

        <div className="mt-4 text-sm space-y-1">
          <p><b>Phone:</b> {player.phone}</p>
          <p><b>Email:</b> {player.email}</p>
          <p><b>DOB:</b> {new Date(player.dob).toLocaleDateString()}</p>
          <p><b>Team:</b> {player.team}</p>
          <p><b>Role:</b> {player.role}</p>
          <p><b>Batting:</b> {player.battingStyle}</p>
          <p><b>Bowling:</b> {player.bowlingStyle}</p>
          <p><b>Address:</b> {player.address}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
