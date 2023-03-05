import React from 'react'
import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div id="App">
      <div className="navbar">
        <div className="flex-1">
          <a className="btn-ghost btn text-xl normal-case">Trident</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <Link className="text-xl" to="/lens">
              DAOs
            </Link>
            <Link className="text-xl" to="/lens">
              Lens
            </Link>
            <Link className="text-xl" to="/graph">
              Graph
            </Link>
          </ul>
        </div>
      </div>

      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
