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
      <div className="navbar font-sans">
        <div className="flex-1">
          <Link className="btn-ghost btn text-xl normal-case " to="/">
            Trident
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal space-x-2 px-1">
            <Link className="btn-ghost btn text-xl" to="/daos">
              DAOs
            </Link>
            <Link className="btn-ghost btn text-xl" to="/lens">
              Lens
            </Link>
            <Link className="btn-ghost btn text-xl" to="/graph">
              Graph
            </Link>
            <Link className="btn-ghost btn text-xl" to="/app">
              Launch App
            </Link>
            <Profile />
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
