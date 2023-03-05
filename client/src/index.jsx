import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import DaoTable from './daos/DaoTable.tsx'
import { EthProvider } from './contexts/EthContext'
import Layout from './Layout'
import Graph from './routes/graph'

import './styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/lens',
        element: 'lens',
      },
      {
        path: '/daos',
        element: <DaoTable />,
      },
      {
        path: '/graph',
        element: <Graph />,
      },
    ],
  },
])

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <EthProvider>
        <RouterProvider router={router} />
      </EthProvider>
    </WagmiConfig>
  </React.StrictMode>
)
