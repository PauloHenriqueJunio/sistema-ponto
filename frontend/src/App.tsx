import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

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

  const [showModal, setShowModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

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
      toast.error("Selecione um funcionário primeiro!");
      return;
    }

    const promise = fetch("http://localhost:3000/pontos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUserId,
        type: tipo,
      }),
    }).then((response) => {
      if (!response.ok) throw new Error("Erro ao registrar ponto");
      fetchPontos();
      return response;
    });

    toast.promise(promise, {
      loading: "Registrando ponto...",
      success: "Ponto registrado com sucesso!",
      error: "Erro ao registrar ponto",
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const promise = fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: newUserName,
        email: newUserEmail,
        password: "123",
        role: "FUNCIONARIO",
      }),
    }).then((response) => {
      if (!response.ok) throw new Error("Email já existe ou dados inválidos");
      setShowModal(false);
      setNewUserName("");
      setNewUserEmail("");
      fetchUsers();
      return response;
    });

    toast.promise(promise, {
      loading: "Criando funcionário...",
      success: "Funcionário criado com sucesso!",
      error: (err) => `Erro: ${err.message}`,
    });
  };

  const handleDeletePonto = async (id: number) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Deletar',
      cancelButtonText: 'Cancelar',
      background: '#f8f9fa'
    });

    if (!result.isConfirmed) return;

    try {
      const promise = fetch(`http://localhost:3000/pontos/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir registro");
        fetchPontos();
        return res;
      });

      await toast.promise(promise, {
        loading: "Excluindo...",
        success: "Registro apagado!",
        error: "Erro ao excluir registro",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir registro");
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
      <Toaster position="top-right" reverseOrder={true} />
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-slate-800 p-6 text-white text-center justify-between items-center">
          <h1 className="text-3xl font-bold">Ponto Eletrônico</h1>
          <p className="text-slate-400 mt-2">Sistema de Gestão de Jornada</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 mt-2 rounded-lg text-sm font-bold transition shadow-lg"
          >
            Novo Funcionário
          </button>
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
                    <button
                      onClick={() => handleDeletePonto(ponto.id)}
                      className="ml-2 text-gray-400 hover:text-red-600 transition p-1 rounded-full hover:bg-red-50 hover:underline"
                      title="Excluir registro"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Novo funcionário
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 -mt-10 -mr-2 hover:text-gray-600 hover:bg-opacity-100 text-2xl font-light transition"
              >
                x
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
