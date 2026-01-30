import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
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

  return (
    <form onSubmit={handleLogin} aria-label="form-login">
      <h2>Login</h2>

      <label htmlFor="email">E-mail</label>
      <input
        id="email"
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-required
      />

      <label htmlFor="senha">Senha</label>
      <input
        id="senha"
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
        aria-required
      />

      <button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>

      {erro && <p role="alert">{erro}</p>}
    </form>
  );
}
