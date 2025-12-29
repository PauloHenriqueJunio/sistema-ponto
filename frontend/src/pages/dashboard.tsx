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
    <div className="min-h-screen bg-gray-100 dark-bg-slate-900 text-gray-800 dark:text-white p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-gray-500 text-sm font-bold uppercase" >
            Média diária de horas trabalhadas
          </h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            8h 15min
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
      </div>
    </div>
    
  );
}

export default Dashboard;
