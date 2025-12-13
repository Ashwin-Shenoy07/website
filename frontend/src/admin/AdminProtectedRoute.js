import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);

useEffect(() => {
  axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/auth/check`, {
      withCredentials: true
    })
    .then(() => setAuthorized(true))
    .catch(() => setAuthorized(false));
}, []);

  if (authorized === null) {
    return <div>Checking admin access...</div>;
  }

  if (!authorized) {
    window.location.href = "/admin/login";
    return null;
  }

  return children;
};

export default AdminProtectedRoute;
