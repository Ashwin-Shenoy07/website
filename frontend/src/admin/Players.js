import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import PlayerModal from "./PlayerModal";
import "./Players.css";

const allColumns = [
  { key: "regNumber", label: "Reg No" },
  { key: "name", label: "Name" },
  { key: "mobile", label: "Mobile" }
];

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState(
    allColumns.map(c => c.key)
  );

  const [sortConfig, setSortConfig] = useState({
    key: "regNumber",
    direction: "asc"
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------- FETCH ----------------
  const fetchPlayers = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/admin/players?page=${page}&limit=10`,
      { withCredentials: true }
    );

    setPlayers(res.data.players || []);
    setTotalPages(res.data.totalPages || 1);
  };

  useEffect(() => {
    fetchPlayers();
  }, [page]);

  // ---------------- SORT ----------------
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // ---------------- SELECT ----------------
  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === players.length) {
      setSelected([]);
    } else {
      setSelected(players.map(p => p._id));
    }
  };

  // ---------------- EXPORT ----------------
  const exportToExcel = () => {
    const exportData = players
      .filter(p => selected.includes(p._id))
      .map(p => ({
        RegNo: p.regNumber,
        Name: p.name,
        Mobile: p.mobile,
        Place: p.place,
        Category: p.category,
        Batting: p.battingStyle,
        Bowling: p.bowlingStyle
      }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Players");
    XLSX.writeFile(wb, "players.xlsx");
  };

  // ---------------- COLUMN TOGGLE ----------------
  const toggleColumn = (key) => {
    setVisibleColumns(prev =>
      prev.includes(key)
        ? prev.filter(c => c !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="players-container">
      <h2>Registered Players</h2>

      {/* Controls */}
      <div className="controls">
        <button onClick={exportToExcel} disabled={!selected.length}>
          Export Selected
        </button>

        <div className="column-selector">
          Columns:
          {allColumns.map(col => (
            <label key={col.key}>
              <input
                type="checkbox"
                checked={visibleColumns.includes(col.key)}
                onChange={() => toggleColumn(col.key)}
              />
              {col.label}
            </label>
          ))}
        </div>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.length === players.length && players.length > 0}
                onChange={selectAll}
              />
            </th>

            {allColumns.map(col =>
              visibleColumns.includes(col.key) && (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label}
                  {sortConfig.key === col.key &&
                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {sortedPlayers.length ? (
            sortedPlayers.map(player => (
              <tr key={player._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(player._id)}
                    onChange={() => toggleSelect(player._id)}
                  />
                </td>

                {visibleColumns.includes("regNumber") && (
                  <td>{player.regNumber}</td>
                )}

                {visibleColumns.includes("name") && (
                  <td
                    className="clickable"
                    onClick={() => setActivePlayer(player._id)}
                  >
                    {player.name}
                  </td>
                )}

                {visibleColumns.includes("mobile") && (
                  <td>{player.mobile}</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                No players found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>
        <span>{page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>

      {/* Player Modal */}
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
