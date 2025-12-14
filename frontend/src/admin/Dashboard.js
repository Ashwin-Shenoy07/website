import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}api/players/viewPlayers`, {
        withCredentials: true
      })
      .then(res => {
        setTotalPlayers(res.data.length);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <div className="stat-card">
        <h3>Total Registered Players</h3>
        <p>{totalPlayers}</p>
      </div>
    </div>
  );
};

export default Dashboard;
