import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { AuthContext } from "../AppContext/AppContext";

const Layout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {user && <Navbar />}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;