import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import BasicLayout from "@/layouts/BasicLayout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Groups from "./pages/Groups";
import HomePage from "./pages/home/HomePage";
import EditorPage from "./pages/editor/editorPage";
import TemplatePage from "./pages/template/TemplatePage";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <BasicLayout />,
    children: [
      { path: "/home", element: <ProtectedRoute component={HomePage} /> },
      {
        index: true,
        element: <ProtectedRoute component={Dashboard} />,
      },
      {
        path: "/clients",
        element: <ProtectedRoute component={Clients} />,
      },
      {
        path: "/groups",
        element: <ProtectedRoute component={Groups} />,
      },
      {
        path: "/templates",
        element: <ProtectedRoute component={TemplatePage} />,
      },
    ],
  },
  {
    path: "/editor/:id?",
    element: <ProtectedRoute component={EditorPage} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
