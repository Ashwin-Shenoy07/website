import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import PlayerModal from "./PlayerModal";
import "./Players.css";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activePlayer, setActivePlayer] = useState(null);

const fetchPlayers = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/admin/players?page=${page}&limit=10`,
      { withCredentials: true }
    );

    setPlayers(res.data.players || []);
    setTotalPages(res.data.totalPages || 1);
  } catch (error) {
    console.error("Error fetching players:", error);
    setPlayers([]);
  }
};

useEffect(() => {
  fetchPlayers();
}, [page]);

  const toggleSelect = (id) => {
    setSelected(
      selected.includes(id)
        ? selected.filter(i => i !== id)
        : [...selected, id]
    );
  };

  const exportToExcel = () => {
    const exportData = players
      .filter(p => selected.includes(p._id))
      .map(p => ({
        Name: p.name,
        Phone: p.phone,
        Email: p.email,
        Team: p.team,
        Role: p.role
      }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Players");
    XLSX.writeFile(workbook, "players.xlsx");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Registered Players</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search players..."
          className="border p-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border p-2"
        >
          <option value={10}>10 rows</option>
          <option value={25}>25 rows</option>
          <option value={50}>50 rows</option>
        </select>

        <button
          onClick={exportToExcel}
          disabled={!selected.length}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Selected
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th></th>
            <th>Name</th>
            <th>Phone</th>
            <th>Team</th>
            <th>Role</th>
            <th>Registered</th>
          </tr>
        </thead>
        <tbody>
  {players.length > 0 ? (
    players.map(player => (
      <tr key={player._id}>
        <td>{player.regNumber}</td>
        <td>{player.name}</td>
        <td>{player.mobile}</td>
        <td>{player.category}</td>
        <td>{player.place}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
        No players found
      </td>
    </tr>
  )}
</tbody>

      </table>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {activePlayer && (
        <PlayerModal
          playerId={activePlayer}
          onClose={() => setActivePlayer(null)}
        />
      )}
    </div>
  );
};

export default Players;
