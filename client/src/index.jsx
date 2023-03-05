import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DaoTable from './daos/DaoTable.tsx'
import { EthProvider } from './contexts/EthContext'
import Layout from './Layout'
import Graph from './routes/graph'
import ProtocolApp from './app/ProtocolApp'
import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import './styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/lens',
        element: <Graph />,
      },
      {
        path: '/daos',
        element: <DaoTable />,
      },
      {
        path: '/app',
        element: <ProtocolApp />,
      },
    ],
  },
])

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider theme={darkTheme()} chains={chains}>
      <EthProvider>
        <RouterProvider router={router} />
      </EthProvider>
    </RainbowKitProvider>
  </WagmiConfig>
)
