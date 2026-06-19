import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();

  const { logout, profile } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-header">

      <div className="header-right">

        <div className="user-menu">

          <button
            className="user-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            👤 {profile?.nombre || "Usuario"} ▼
          </button>

          {menuOpen && (
            <div className="dropdown-menu">

              <button
                onClick={() => navigate("/")}
                className="dropdown-item"
              >
                🏠 Inicio
              </button>

              <button className="dropdown-item">
                👤 Mi Perfil
              </button>

              <button className="dropdown-item">
                ⚙️ Configuración
              </button>

            </div>
          )}

        </div>

        <button
          onClick={logout}
          className="logout-icon"
          title="Cerrar sesión"
        >
          🚪
        </button>

      </div>

    </div>
  );
}