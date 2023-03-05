import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Profile() {
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  if (isConnected) return <div>Connected to {ensName ?? address}</div>
  return <button onClick={() => connect()}>Connect Wallet</button>
}

function Layout() {
  return (
    <div id="App">
      <div className="navbar">
        <div className="flex-1">
          <a className="btn-ghost btn text-xl normal-case">Trident</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <Link className="text-xl" to="/daos">
              DAOs
            </Link>
            <Link className="text-xl" to="/lens">
              Lens
            </Link>
            <Link className="text-xl" to="/graph">
              Graph
            </Link>
            <Link className="text-xl" to="/app">
              Launch App
            </Link>
            <Profile />
          </ul>
        </div>
      </div>

      <div className="container min-w-full">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
