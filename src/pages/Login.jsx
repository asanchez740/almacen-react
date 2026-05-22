import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {

  const {
    login,
    user,
  } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    setLoading(true);

    const { error } = await login(
      email,
      password
    );

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-md w-[350px]">

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              p-3
              rounded-lg
            "
          >
            {loading
              ? "Entrando..."
              : "Entrar"}
          </button>

        </div>

      </div>

    </div>
  );
}