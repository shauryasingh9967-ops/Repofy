import React from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = ({ children, onSearch }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onSearch={onSearch} />
        <main className="flex-1 px-4 md:px-8 py-6 fade-in">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
