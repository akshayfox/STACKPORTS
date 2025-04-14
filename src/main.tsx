import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./index.css";

import BasicLayout from "@/layouts/BasicLayout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Groups from "./pages/Groups";
import HomePage from "./pages/home/HomePage";
import EditorPage from "./pages/editor/editorPage";
import TemplatePage from "./pages/template/TemplatePage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <BasicLayout />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/clients", element: <Clients /> },
      { path: "/groups", element: <Groups /> },
      { path: "/templates", element: <TemplatePage /> },
    ],
  },
  {
    path: "/editor/:id?", // standalone route (no layout)
    element: <EditorPage />,
  },
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
