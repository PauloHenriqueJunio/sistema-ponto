import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl flex items-center gap-2">
            Ponto Eletrônico
          </div>
          <div className="flex gap-4">
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
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;