// index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DealerList from "./pages/DealerList.jsx";
import AddDealer from "./pages/AddDealer.jsx";
import SignUp from "./pages/SignUp.jsx";
import AuthLayout from "./AuthLayout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,      // 👈 provider lives *inside* the router
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },

      {
        path: "/",
        element: (
          <PrivateRoute>
            <App />
          </PrivateRoute>
        ),
        children: [
          { path: "home", element: <Dashboard /> },
          { path: "dealers", element: <DealerList /> },
          { path: "add-dealer", element: <AddDealer /> },
          { index: true, loader: () => redirect("/home") }, // optional default
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
