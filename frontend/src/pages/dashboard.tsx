import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardData {
  pizza: { name: string; value: number }[];
  barras: { nome: string; registros: number }[];
  resumo: {
    totalRegistro: number;
    totalUsuarios: number;
  };
}

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((dados) => setData(dados))
      .catch((err) =>
        console.error("Erro ao carregar dados do dashboard:", err)
      );
  }, []);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">Carregando dados...</div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-white p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
        Dashboard Gerencial
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">
            Total de Registros
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {data.resumo.totalRegistro}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">
            Funcionários
          </h3>
          <p className="text-3xl font-bold text-green-500 mt-2">
            {data.resumo.totalUsuarios}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">
            Status do Sistema
          </h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">Online</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4">
            Atividade (Nº de Registros)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.barras}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="nome"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="registros"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4">Distribuição por Tipo</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pizza}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.pizza.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
                <Legend formatter={(value) => value.replace("_", " ")} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
