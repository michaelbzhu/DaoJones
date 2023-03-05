import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function Layout() {
  return (
    <div id="App">
      <div className="navbar font-sans">
        <div className="flex-1">
          <Link className="btn btn-ghost normal-case text-xl" to="/">The DAO Jones</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 space-x-2">
            <Link className="text-xl" to="/daos">
              DAOs
            </Link>
            <Link className="btn-ghost btn text-xl" to="/lens">
              Lens
            </Link>
            <Link className="text-xl" to="/app">
              Launch App
            </Link>
            <ConnectButton />
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
