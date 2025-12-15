// src/admin/AdminProtectedRoute.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const check = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}api/admin/auth/check`,
          { withCredentials: true }
        );
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      }
    };
    check();
  }, []);

  if (authorized === null) return <div>Checking authentication...</div>;

  return authorized ? children : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;
