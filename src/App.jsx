import { useState } from "react";
import { useAlmacen } from "./hooks/useAlmacen";
import { Search } from "lucide-react";
import "./styles/almacen.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Almacen from "./pages/Almacen";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/almacen" element={<Almacen />} />

      </Routes>

    </BrowserRouter>
  );
}