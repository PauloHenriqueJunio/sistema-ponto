import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

interface Ponto {
  id: number;
  type: string;
  timestamp: string;
  user: { name: string };
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const fetchUsers = () => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  const fetchPontos = () => {
    fetch("http://localhost:3000/pontos")
      .then((res) => res.json())
      .then((data) => setPontos(data));
  };

  useEffect(() => {
    fetchUsers();
    fetchPontos();
  }, []);

  const handleBaterPonto = async (tipo: string) => {
    if (!selectedUserId) {
      alert("Selecione um funcionário primeiro!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/pontos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          type: tipo,
        }),
      });

      if (response.ok) {
        fetchPontos();
      } else {
        alert("Erro ao registrar ponto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "ENTRADA":
        return "bg-green-100 text-green-800 border-green-200";
      case "SAIDA":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-slate-800 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Ponto Eletrônico</h1>
          <p className="text-slate-400 mt-2">Sistema de Gestão de Jornada</p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Identifique-se:
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">-- Selecione seu nome --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => handleBaterPonto("ENTRADA")}
              className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow transition transform hover:-translate-y-1"
            >
              Iniciar Jornada
            </button>

            <button
              onClick={() => handleBaterPonto("SAIDA_ALMOCO")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow transition opacity-90 hover:opacity-100"
            >
              Ida Almoço
            </button>

            <button
              onClick={() => handleBaterPonto("VOLTA_ALMOCO")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow transition opacity-90 hover:opacity-100"
            >
              Volta Almoço
            </button>

            <button
              onClick={() => handleBaterPonto("SAIDA")}
              className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow transition transform hover:-translate-y-1"
            >
              Encerrar Dia
            </button>
          </div>

          <hr className="my-6 border-gray-200" />

          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            Últimos Registros
          </h3>

          {pontos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum registro hoje.
            </p>
          ) : (
            <div className="space-y-3">
              {pontos.map((ponto) => (
                <div
                  key={ponto.id}
                  className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-blue-50 transition"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700">
                      {ponto.user?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      ID: #{ponto.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(
                        ponto.type
                      )}`}
                    >
                      {ponto.type.replace("_", " ")}
                    </span>
                    <span className="text-gray-600 font-mono font-medium">
                      {new Date(ponto.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
