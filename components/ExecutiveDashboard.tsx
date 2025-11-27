// components/ExecutiveDashboard.tsx
import React from 'react';
import { 
  TrendingUp, Users, DollarSign, Clock, 
  AlertTriangle, ArrowUp, ArrowDown 
} from 'lucide-react';

interface ExecutiveDashboardProps {
  darkMode: boolean;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ darkMode }) => {
  // Dados mockados - você integrará com seus dados reais
  const kpiData = {
    totalCost: 45230,
    costVariation: 12.5,
    activeEmployees: 142,
    totalHours: 2840,
    overtimeCost: 18760,
    efficiency: 94.2
  };

  const monthlyTrend = [
    { month: 'Jan', hours: 1200, cost: 38000 },
    { month: 'Fev', hours: 1350, cost: 40500 },
    { month: 'Mar', hours: 1420, cost: 42500 },
    { month: 'Abr', hours: 1560, cost: 45230 }
  ];

  const TrendIndicator = ({ value }: { value: number }) => (
    <div className={`flex items-center text-sm ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
      {Math.abs(value)}%
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* KPIs Executivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Custo Total */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Custo Total Hrs</p>
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpiData.totalCost)}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <TrendIndicator value={kpiData.costVariation} />
        </div>

        {/* Colaboradores Ativos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Colaboradores Ativos</p>
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{kpiData.activeEmployees}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            +5 este mês
          </div>
        </div>

        {/* Horas Totais */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Horas Totais</p>
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{kpiData.totalHours}h</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <TrendIndicator value={8.3} />
        </div>

        {/* Eficiência */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Eficiência</p>
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{kpiData.efficiency}%</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <TrendIndicator value={2.1} />
        </div>
      </div>

      {/* Gráficos e Métricas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução Mensal */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Evolução Mensal - Custos vs Horas
          </h3>
          <div className="space-y-3">
            {monthlyTrend.map((item, index) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.hours}h
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.cost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas e Ações */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            Alertas do Sistema
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Setor Produção</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">Horas extras acima do limite</p>
              </div>
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">+42%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">Importação Pendente</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">Planilha de abril aguardando</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Dias Úteis</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 18.760</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Custo Hrs Extras</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Precisão</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Setores Ativos</p>
        </div>
      </div>
    </div>
  );
};