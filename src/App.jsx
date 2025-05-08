// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate, // ← add this import
  useLocation, // ← if you’re logging location
} from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import BookDemoPage from "./pages/BookDemoPage";
function AppRoutes() {
  const loc = useLocation();
  console.log("[AppRoutes] location =", loc.pathname);
  const { loading } = useContext(AuthContext);

  // 1) Show spinner until AuthContext done initializing
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span>Loading…</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/book-demo" element={<BookDemoPage />} />

      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
