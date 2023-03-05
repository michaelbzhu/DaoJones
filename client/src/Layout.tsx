import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function Layout() {
  const location = useLocation()
  return (
    <div id="App">
      <div className="navbar font-sans">
        <div className="flex-1">
          <Link className="btn btn-ghost normal-case text-xl" to="/">The DAO Jones</Link>
          <ul className="menu menu-horizontal p-1 space-x-2">
            <Link className="btn-ghost btn text-xl" to="/">
              DAOs
            </Link>
            <Link className="btn-ghost btn text-xl" to="/lens">
              Lens
            </Link>
          </ul>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 space-x-2">
            {location.pathname !== '/app'
              ? <Link className="btn-ghost btn text-xl" to="/app">
                Launch App {">"}
              </Link>
              : <ConnectButton />}
          </ul>
        </div>
      </div>

      <div className="container min-w-full ">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
