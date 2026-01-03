import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
          <nav className="bg-slate-900 dark:bg-slate-950 text-white p-4 shadow-md transition-colors duration-300">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div className="font-bold text-xl flex items-center gap-2">
                Ponto Eletrônico
              </div>
              <div className="flex items-center gap-6">
                <Link
                  to="/"
                  className="hover:underline hover:text-blue-400 transition font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-400 transition font-medium hover:underline"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition transform hover:scale-110 active:scale-95"
                  title="Alternar Tema"
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
