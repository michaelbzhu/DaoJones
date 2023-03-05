import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import GovernorTable from './components/GovernorTable'

function Layout() {
  return (
    <div id="App">
      <div className="container">
        <Link className="text-xl" to="/lens">
          LENS LINK
        </Link>
        <Link className="text-xl" to="/table">
          TABLE LINK
        </Link>
        <hr />
        <GovernorTable />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
