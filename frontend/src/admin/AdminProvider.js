import React, { useState } from "react";
import AdminContext from "./AdminContext";

const AdminProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <AdminContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;