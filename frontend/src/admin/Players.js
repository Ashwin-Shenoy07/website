import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./Players.css";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/admin/players`,
        {
          params: { page, limit, search },
          withCredentials: true
        }
      );

      const data = res.data.players || [];
      setPlayers(data);
      setTotalPages(res.data.totalPages || 1);

      // Dynamically extract column names
      if (data.length > 0) {
        const keys = Object.keys(data[0]).filter(
          key => !["_id", "__v", "createdAt", "updatedAt"].includes(key)
        );
        setColumns(keys);
      }
    } catch (err) {
      console.error("Error fetching players:", err);
      setPlayers([]);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [page, limit, search]);

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const exportToExcel = () => {
    const exportData = players
      .filter(p => selected.includes(p._id))
      .map(p => {
        const row = {};
        columns.forEach(col => {
          row[col] = p[col];
        });
        return row;
      });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Players");
    XLSX.writeFile(workbook, "players.xlsx");
  };

  return (
    <div className="players-container">
      <h2>Registered Players</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={10}>10 rows</option>
          <option value={25}>25 rows</option>
          <option value={50}>50 rows</option>
        </select>

        <button disabled={!selected.length} onClick={exportToExcel}>
          Export Selected
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Select</th>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {players.length ? (
            players.map(player => (
              <tr key={player._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(player._id)}
                    onChange={() => toggleSelect(player._id)}
                  />
                </td>

                {columns.map(col => (
                  <td key={col}>
                    {typeof player[col] === "object" && player[col] !== null
                      ? JSON.stringify(player[col])
                      : player[col]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="no-data">
                No players found
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default Players;
