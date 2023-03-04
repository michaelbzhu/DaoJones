import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Intro from './components/Intro'
import Setup from './components/Setup'
import Demo from './components/Demo'
import Footer from './components/Footer'

function Layout() {
  return (
    <div id="App">
      <div className="container">
        <Link to="/lens">LENS LINK</Link>
        <Link to="/table">TABLE LINK</Link>
        <Intro />
        <hr />
        <Setup />
        <hr />
        <Demo />
        <hr />
        <Footer />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
