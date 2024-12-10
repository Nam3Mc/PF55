"use client"; 
import React, { useState } from "react";

type LoginData = {
  email: string;
  password: string; // Reemplaza dni por password
};

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simulación de usuarios registrados
    const registeredUsers = [
      { email: "test@example.com", password: "password123" }, // Ejemplo
    ];

    const user = registeredUsers.find(
      (u) => u.email === loginData.email && u.password === loginData.password
    );

    if (user) {
      setIsLoggedIn(true);
      setError(null);
      console.log("Inicio de sesión exitoso:", user);
    } else {
      setIsLoggedIn(false);
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-[#fffefe] text-[#0a0a0a] pt-20 lg:pt-40 pb-20">
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-2xl px-5 sm:px-10 mb-10 lg:mb-0">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4">
            Che! Volviste
          </h2>
          <p className="leading-relaxed text-base sm:text-lg lg:text-xl mb-6">
            Bienvenido de nuevo, por favor inicia sesión para continuar.
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg p-6 sm:p-8 bg-white bg-opacity-90 border border-[#0a0a0a] rounded-md shadow-lg space-y-6 lg:ml-20">
        <h2 className="text-xl sm:text-2xl font-bold text-center tracking-wider">
          Inicia sesión
        </h2>

        {isLoggedIn ? (
          <p>¡Inicio de sesión exitoso! Bienvenido/a.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-lg text-[#0a0a0a]">Email:</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-[#0a0a0a] text-lg text-[#0a0a0a] placeholder-gray-500 focus:outline-none p-2"
              />
            </div>

            <div className="relative">
              <label className="block text-lg text-[#0a0a0a]">Contraseña:</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-[#0a0a0a] text-lg text-[#0a0a0a] placeholder-gray-500 focus:outline-none p-2"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full border border-[#0a0a0a] text-[#0a0a0a] text-sm py-2 bg-[#a6d2ff] rounded-md hover:bg-[#76bafe] transition duration-300"
            >
              Inicia Sesión
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="text-center mt-4">
          <p className="text-sm">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm">
            ¿Olvidaste tu contraseña?{" "}
            <a href="/forgotPassword" className="text-blue-600 hover:underline">
              Recupérala aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
