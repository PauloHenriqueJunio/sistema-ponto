import React from "react";
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

function Dashboard() {
  const dadosBarra = [
    { nome: "João", horas: 160 },
    { nome: "Félix", horas: 155 },
    { nome: "Yuri Alberto", horas: 90 },
    { nome: "Garro", horas: 200 },
    { nome: "Memphis DeMãe", horas: 220 },
  ];

  const dadosPizza = [
    { nome: "ENTRADAS", value: 400 },
    { nome: "SAIDAS", value: 300 },
    { nome: "ALMOÇO", value: 300 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];



  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-white p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
        Dashboard Gerencial
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total de Horas</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">1,240h</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Funcionários Ativos</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">12</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Média Diária</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">8h 15m</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4">Horas Trabalhadas (Mês)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosBarra}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="nome" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="horas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4">Tipos de Registro</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
