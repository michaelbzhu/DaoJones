import React from 'react';
import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div id="App">
      <div className="navbar font-sans">
        <div className="flex-1">
          <Link className="btn btn-ghost normal-case text-xl" to="/">Trident</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 space-x-2">
          <Link className="text-xl" to="/lens">DAOs</Link>
          <Link className="text-xl" to="/lens">Lens</Link>
          <Link className="text-xl" to="/graph">Graph</Link>
          </ul>
        </div>
      </div>

      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
