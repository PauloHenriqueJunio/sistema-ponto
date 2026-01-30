import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    try {
      const responde = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      if (Response.ok) {
        const { token } = await Response.json();
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        setErro("Usuário ou senha inválidos");
      }
    } catch {
      setErro("Erro ao conectar ao servidor");
    }
  };

  return (
    <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        />
        <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        required
        />
    <button type="submit">Entrar</button>
    {erro && <p>{erro}</p>}
    </form>
  )

}
