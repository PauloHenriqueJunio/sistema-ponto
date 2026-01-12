import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [darkMode] = useState(false);
  const [busca, setBusca] = useState("");

  const fetchUsers = useCallback(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const fetchPontos = useCallback(
    async (paginaParaBuscar = 1, resetar = false) => {
      try {
        if (paginaParaBuscar > 1) setCarregandoMais(true);

        const response = await fetch(
          `http://localhost:3000/pontos?page=${paginaParaBuscar}&limit=9`
        );
        if (!response.ok) {
          let errorMessage = `Erro HTTP ao buscar registros de ponto: ${response.status} ${response.statusText}`;
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage += ` - ${errorText}`;
            }
          } catch (err) {
            console.error("Erro ao ler texto de resposta:", err);
          }
          throw new Error(errorMessage);
        }
        const resultado = await response.json();

        if (resetar) {
          setPontos(resultado.data);
        } else {
          setPontos((prev) => [...prev, ...resultado.data]);
        }

        setTotalPaginas(paginaParaBuscar < resultado.totalPaginas);
        setCarregandoMais(false);
      } catch (error) {
        console.error("Erro ao buscar registros de ponto:", error);
        setCarregandoMais(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
    fetchPontos();
  }, [fetchUsers, fetchPontos]);

  const handleCarregarMais = () => {
    const proximaPagina = pagina + 1;
    setPagina(proximaPagina);
    fetchPontos(proximaPagina, false);
  };

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
      setPagina(1);
      fetchPontos(1, true);
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
      title: "Tem certeza?",
      text: "Você não poderá reverter isso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Deletar",
      cancelButtonText: "Cancelar",
      background: "#f8f9fa",
    });

    if (!result.isConfirmed) return;

    try {
      const promise = fetch(`http://localhost:3000/pontos/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir registro");
        setPagina(1);
        fetchPontos(1, true);
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

  const handleEditPonto = async (ponto: Ponto) => {
    const { value: novoTipo } = await Swal.fire({
      title: "Corrigir registro",
      text: `Mudar de ${ponto.type.replace("_", " ")} para:`,
      icon: "question",
      input: "select",
      inputOptions: {
        ENTRADA: "Entrada",
        SAIDA_ALMOCO: "Ida Almoço",
        VOLTA_ALMOCO: "Volta Almoço",
        SAIDA: "Saída",
      },
      inputValue: ponto.type,
      showCancelButton: true,
      confirmButtonText: "Salvar Correção",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Cancelar",
    });

    if (novoTipo) {
      try {
        const response = await fetch(
          `http://localhost:3000/pontos/${ponto.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: novoTipo }),
          }
        );

        if (response.ok) {
          Swal.fire(
            "Atualizado!",
            "O tipo do registro foi corrigido.",
            "success"
          );
          setPagina(1);
          fetchPontos(1, true);
        } else {
          toast.error("Erro ao atualizar");
        }
      } catch (error) {
        console.error(error);
      }
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

  const pontosFiltrados = pontos.filter(
    (ponto) =>
      ponto.user?.name.toLowerCase().includes(busca.toLowerCase()) ||
      ponto.type.toLowerCase().includes(busca.toLowerCase())
  );

  const handleExportPDF = async () => {
    const response = await fetch("http://localhost:3000/pontos?limit=100");
    const pontosPDF = await response.json();
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Ponto Eletrônico", 14, 22);

    doc.setFontSize(10);
    doc.text(
      `Relatório gerado em ${new Date().toLocaleDateString()} ás ${new Date().toLocaleTimeString()}`,
      14,
      30
    );

    const dadosDaTabela = pontosPDF.map((ponto: Ponto) => [
      ponto.id,
      ponto.user?.name,
      new Date(ponto.timestamp).toLocaleString(),
      new Date(ponto.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ponto.type.replace("_", " "),
    ]);

    autoTable(doc, {
      head: [[`ID`, `Funcionário`, `Data`, `Hora`, `Tipo`]],
      body: dadosDaTabela,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 163, 74] },
      didDrawPage: () => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        doc.setFontSize(9);
        doc.text("Desenvolvido por Paulo Henrique", 14, pageHeight - 10);
      },
    });

    doc.save(`folha-de-ponto.pdf`);
    toast.success("PDF baixado com sucesso!");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300 py-10 px-4 font-sans">
        <Toaster position="top-right" reverseOrder={true} />
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-slate-800 p-6 text-white text-center justify-between items-center relative">
            <h1 className="text-3xl font-bold">Ponto Eletrônico</h1>
            <p className="text-slate-400 mt-2">Sistema de Gestão de Jornada</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 mt-2 mr-2 rounded-lg text-sm font-bold transition shadow-lg"
            >
              Novo Funcionário
            </button>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Identifique-se:
              </label>
              <select
                className="w-full p-3 border border-gray-300 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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

            <hr className="my-6 border-gray-200 dark:border-slate-700" />

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"></div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
              Últimos Registros
              <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-slate-700 dark:text-gray-400 px-2 py-0.5 mt-1 rounded-full">
                {pontosFiltrados.length}
              </span>
            </h3>

            <div className="w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                <input
                  type="text"
                  placeholder="Buscar por nome ou tipo"
                  className="mb-4 w-full sm:w-64 p-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />

                <button
                  onClick={handleExportPDF}
                  className="mb-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition shadow-sm flex items-center justify-center gap-2"
                  title="Baixar PDF"
                >
                  📄 <span className="hidden sm:inline">PDF</span>
                </button>
              </div>

              {pontosFiltrados.length === 0 ? (
                <div className="text-center py-10 opacity-70">
                  <p className="text-gray-500 dark:text-gray-300 font-medium">
                    {busca
                      ? `Nenhum registro encontrado para "${busca}".`
                      : "Nenhum registro de ponto encontrado"}
                  </p>
                  {busca && (
                    <button
                      onClick={() => setBusca("")}
                      className="text-blue-500 hover:underline text-sm font-semibold mt-2"
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {pontosFiltrados.map((ponto) => (
                    <div
                      key={ponto.id}
                      className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-lg hover:bg-blue-50 transition gap-3"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700 dark:text-white text-lg sm:text-base">
                          {ponto.user?.name}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-300">
                          ID: #{ponto.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-300 font-mono font-medium text-sm">
                            {new Date(ponto.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-bold border ${getBadgeColor(
                              ponto.type
                            )}`}
                          >
                            {ponto.type.replace("_", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditPonto(ponto)}
                            className="text-gray-400 dark:text-gray-300 hover:text-blue-600 transition text-sm font-medium hover:underline"
                            title="Corrigir registro"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeletePonto(ponto.id)}
                            className="text-gray-400 dark:text-gray-300 hover:text-red-600 transition text-sm font-medium hover:underline"
                            title="Excluir registro"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {totalPaginas && !busca && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={handleCarregarMais}
                        disabled={carregandoMais}
                        className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {carregandoMais ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                            <span>Carregando...</span>
                          </>
                        ) : (
                          "Carregar mais registros"
                        )}
                      </button>
                    </div>
                  )}
                  {!totalPaginas && pontos.length > 0 && !busca && (
                    <p className="text-center text-gray-400 mt-6 text-sm italic">
                      Todos os registros já foram carregados.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full p-2 border bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-lg transition"
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
      </div>

      <footer className="py-6 text-center shadow-lg dark:bg-slate-800">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Desenvolvido por {``}
          <a
            href="https://github.com/PauloHenriqueJunio"
            rel="noopener noreferrer"
            target="_blank"
            className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition"
          >
            Paulo Henrique
          </a>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          @ {new Date().getFullYear()} Sistema Ponto • v1.0
        </p>
      </footer>
    </div>
  );
}

export default Home;
