
import { useState } from "react";
import Login from "./pages/Login";
import { useAlmacen } from "./hooks/useAlmacen";
import { Search } from "lucide-react";
import "./styles/almacen.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Almacen from "./pages/Almacen";

export default function App() {
 
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
        />

        <Route
          path="/almacen"
          element={
            <ProtectedRoute>
              <Almacen />
            </ProtectedRoute>
            }
        />

      </Routes>

    </BrowserRouter>
  );
}