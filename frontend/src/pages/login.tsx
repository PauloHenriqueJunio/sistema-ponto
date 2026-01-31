import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [regNome, setRegNome] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regSenha, setRegSenha] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regMsg, setRegMsg] = useState("");

  const navigate = useNavigate();
  const apiBase =
    (import.meta as any).env.VITE_API_URL || "http://localhost:3000";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (res.ok) {
        const data = await res.json();
        const token = data?.token;
        if (token) {
          localStorage.setItem("token", token);
          navigate("/dashboard");
        } else {
          setErro("Resposta inválida do servidor");
        }
      } else {
        try {
          const err = await res.json();
          setErro(err?.message || "Usuário ou senha inválidos");
        } catch {
          setErro("Usuário ou senha inválidos");
        }
      }
    } catch (err) {
      setErro("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegMsg("");
    setRegLoading(true);
    try {
      const res = await fetch(`${apiBase}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail,
          password: regSenha,
          name: regNome,
          role: "FUNCIONARIO",
        }),
      });
      if (res.ok) {
        setRegMsg("Cadastro realizado com sucesso!");
        setShowRegister(false);
        setEmail(regEmail);
        setSenha("");
      } else {
        const err = await res.json().catch(() => null);
        setRegMsg(err?.error || "Erro ao registrar");
      }
    } catch {
      setRegMsg("Erro ao conectar ao servidor");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-slate-800 p-8 rounded shadow w-full max-w-md"
        aria-label="form-login"
      >
        <h2 className="text-2xl dark:text-white font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 p-2 rounded border"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full mb-3 p-2 rounded border"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-bold"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {erro && <p className="mt-2 text-red-500 text-center">{erro}</p>}
        <button
          type="button"
          className="w-full mt-4 text-blue-600 underline"
          onClick={() => setShowRegister(true)}
        >
          Registrar
        </button>
      </form>

      {showRegister && (
        <form
          onSubmit={handleRegister}
          className="bg-white dark:bg-slate-800 p-8 rounded shadow w-full max-w-md mt-6"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Cadastro</h2>
          <input
            type="text"
            placeholder="Nome"
            value={regNome}
            onChange={(e) => setRegNome(e.target.value)}
            required
            className="w-full mb-3 p-2 rounded border"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
            className="w-full mb-3 p-2 rounded border"
          />
          <input
            type="password"
            placeholder="Senha"
            value={regSenha}
            onChange={(e) => setRegSenha(e.target.value)}
            required
            className="w-full mb-3 p-2 rounded border"
          />
          <button
            type="submit"
            disabled={regLoading}
            className="w-full bg-green-600 text-white py-2 rounded font-bold"
          >
            {regLoading ? "Registrando..." : "Registrar"}
          </button>
          {regMsg && <p className="mt-2 text-center text-red-500">{regMsg}</p>}
          <button
            type="button"
            className="w-full mt-4 text-gray-500 underline"
            onClick={() => setShowRegister(false)}
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
