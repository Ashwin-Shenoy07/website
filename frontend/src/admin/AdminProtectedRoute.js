import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/admin/auth/check`, {
          withCredentials: true
        });
        setAuthorized(true);
      } catch (err) {
        setAuthorized(false);
      }
    };
    checkAuth();
  }, []);

  if (authorized === null) return <div>Checking admin access...</div>;
  if (!authorized) return <Navigate to="/admin/login" />;

  return children;
};

export default AdminProtectedRoute;
