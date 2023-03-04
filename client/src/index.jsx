import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { EthProvider } from "./contexts/EthContext";
import Layout from "./Layout";

import Graph from "./routes/graph";

import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/lens",
        element: "lens"
      },
      {
        path: "/graph",
        element: <Graph />
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <EthProvider>
      <RouterProvider router={router} />
    </EthProvider>
  </React.StrictMode>
);
