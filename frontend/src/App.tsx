import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Erro ao buscar usuários:", error));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Sistema de Ponto</h1>
      <p>Gerenciamento de Funcionários</p>

      <hr />

      <h2>Lista de Funcionários</h2>

      {users.length === 0 ? (
        <p>Carregando ou nenhum usuário encontrado...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <strong>{user.name}</strong> <br />
              <small>{user.email}</small> <br />
              <span
                style={{
                  backgroundColor:
                    user.role === "ADMIN" ? "#ef0b0bff" : "#ccffcc",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                }}
              >
                {user.role}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
