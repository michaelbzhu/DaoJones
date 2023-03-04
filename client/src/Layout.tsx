import React from 'react';
import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div id="App">
      <div className="container">
        <Link className="text-xl" to="/lens">LENS LINK</Link>
        <hr />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
