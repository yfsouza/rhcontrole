import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { DashboardChartData, DashboardTrends, TrendData } from '../types';
import { BarChart as BarChartIcon, Clock, TrendingUp, Users, Database, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

// VIEW: Dashboard Charts

interface DashboardProps {
  data: DashboardChartData[];
  trendData: TrendData[]; // New Prop for Line Chart
  totalCollaborators: number;
  totalRegisteredActive: number;
  totalValue60?: number;
  totalValue100?: number;
  dashboardTrends: DashboardTrends;
  loading: boolean;
  darkMode: boolean;
}

const COLOR_60 = '#3B82F6'; // Blue
const COLOR_100 = '#8B5CF6'; // Purple
const COLOR_60_ALT = '#60A5FA'; 
const COLOR_100_ALT = '#A78BFA';

// Helper: Format decimal hours to HH:mm format
const formatDecimalToTime = (decimalHours: number): string => {
  if (!decimalHours) return '';
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Helper: Format Currency
const formatCurrency = (value: number) => {
  if (!value) return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Helper Component for Dashboard Trend
const TrendIndicator: React.FC<{ direction: 'up' | 'down' | 'equal' | null }> = ({ direction }) => {
    if (!direction) return null; // Show nothing if no valid trend (e.g. multi-day view)

    if (direction === 'up') {
        return <ArrowUp className="w-4 h-4 text-red-500 stroke-[3] ml-1" />;
    }
    if (direction === 'down') {
        return <ArrowDown className="w-4 h-4 text-green-500 stroke-[3] ml-1" />;
    }
    if (direction === 'equal') {
        return (
            <div className="flex items-center justify-center w-4 h-4 ml-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
            </div>
        );
    }
    return null;
};


// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 min-w-[200px]">
        {/* Sector Name / Date Label */}
        <p className="font-bold text-gray-800 dark:text-white mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => {
          // Determine formatting based on dataKey
          const isValue = entry.dataKey === 'value60' || entry.dataKey === 'value100';
          const formattedValue = isValue 
            ? formatCurrency(entry.value) 
            : `${formatDecimalToTime(entry.value)}h`;

          return (
            <div key={index} className="flex items-center justify-between gap-8 mb-2 last:mb-0">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                 <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></div>
                 <span className="font-medium">{entry.name}:</span>
              </div>
              <div className="font-bold text-gray-700 dark:text-white text-right">
                {formattedValue}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  trendData,
  totalCollaborators, 
  totalRegisteredActive, 
  totalValue60 = 0,
  totalValue100 = 0,
  dashboardTrends,
  loading, 
  darkMode 
}) => {
  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
        <BarChartIcon className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">Sem dados para exibir</p>
        <p className="text-sm">Ajuste os filtros para visualizar os indicadores.</p>
      </div>
    );
  }

  // Calculate Overall Totals for display
  const overallTotal60 = data.reduce((acc, curr) => acc + curr.hours60, 0);
  const overallTotal100 = data.reduce((acc, curr) => acc + curr.hours100, 0);

  // Dynamic Chart Colors based on Theme
  const axisTextColor = darkMode ? '#9CA3AF' : '#6b7280'; 
  const gridColor = darkMode ? '#374151' : '#e5e7eb'; 
  const cursorFill = darkMode ? 'transparent' : '#f9fafb'; 
  const cursorOpacity = darkMode ? 0 : 0.6;
  const legendTextColor = darkMode ? '#E5E7EB' : '#374151'; 

  return (
    <div className="space-y-6">
      
      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Base de Cadastro (Active in DB) */}
        <div className="bg-white dark:bg-gray-800 px-5 pt-3 pb-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col relative overflow-hidden transition-colors h-28">
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-amber-50 dark:from-amber-900/20 to-transparent pointer-events-none"></div>
          
          {/* Header Row: Title & Icon */}
          <div className="relative z-10 flex justify-between items-start w-full">
             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
               <Database className="w-4 h-4 text-amber-500" />
               Total Colaboradores
             </h3>
             <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg text-amber-600 dark:text-amber-400 shadow-sm">
                <Database className="w-5 h-5" />
             </div>
          </div>
          
          {/* Content Row: Centered Value */}
          <div className="relative z-10 flex flex-grow items-center justify-center">
             <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{totalRegisteredActive}</span>
          </div>
        </div>

        {/* Card 2: Total Collaborators (Unique in Filter) */}
        <div className="bg-white dark:bg-gray-800 px-5 pt-3 pb-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col relative overflow-hidden transition-colors h-28">
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-emerald-50 dark:from-emerald-900/20 to-transparent pointer-events-none"></div>
          
          {/* Header Row: Title & Icon */}
          <div className="relative z-10 flex justify-between items-start w-full">
             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
               <Users className="w-4 h-4 text-emerald-500" />
               Colaboradores Hrs
             </h3>
             <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg text-emerald-600 dark:text-emerald-400 shadow-sm">
                <Users className="w-5 h-5" />
             </div>
          </div>
          
          {/* Content Row: Centered Value */}
          <div className="relative z-10 flex flex-grow items-center justify-center">
             <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{totalCollaborators}</span>
          </div>
        </div>

        {/* Card 3: Combined Total Hours (60% & 100%) - Redesigned Vertical */}
        <div className="bg-white dark:bg-gray-800 px-5 pt-3 pb-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col relative overflow-hidden transition-colors h-28">
          <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-purple-50 dark:from-purple-900/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-start w-full">
             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
               <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
               Totais Hrs
             </h3>
             <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg text-purple-600 dark:text-purple-400 shadow-sm">
                <TrendingUp className="w-5 h-5" />
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center flex-grow mt-0">
             <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-1">
                 {/* 60% Row */}
                 <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <span className="text-lg font-extrabold text-blue-500">{formatDecimalToTime(overallTotal60)}</span>
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 ml-0.5">h</span>
                    </div>
                 </div>

                 {/* 100% Row */}
                 <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <span className="text-lg font-extrabold text-purple-500">{formatDecimalToTime(overallTotal100)}</span>
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 ml-0.5">h</span>
                    </div>
                 </div>
             </div>

             {/* Grand Total */}
             <div className="flex items-center">
                <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
                    {formatDecimalToTime(overallTotal60 + overallTotal100)}
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 ml-0.5">h</span>
                </span>
                <TrendIndicator direction={dashboardTrends.hTotal} />
             </div>
          </div>
        </div>

        {/* Card 4: Financial Values (Redesigned Vertical) - RED THEME */}
        <div className="bg-white dark:bg-gray-800 px-5 pt-3 pb-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col relative overflow-hidden transition-colors h-28">
          <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-red-50 dark:from-red-900/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-start w-full">
             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
               <DollarSign className="w-4 h-4 text-red-600 dark:text-red-400" />
               Valores Hrs
             </h3>
             <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-lg text-red-600 dark:text-red-400 shadow-sm">
                <DollarSign className="w-5 h-5" />
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
             {/* Breakdown Row */}
             <div className="flex justify-center gap-4 mb-1 w-full">
                <div className="flex flex-col items-center">
                    <div className="flex items-center text-blue-500 text-sm font-bold whitespace-nowrap">
                        {formatCurrency(totalValue60)}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center text-purple-500 text-sm font-bold whitespace-nowrap">
                        {formatCurrency(totalValue100)}
                    </div>
                </div>
             </div>
             
             {/* Grand Total */}
             <div className="flex items-center">
                <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none whitespace-nowrap">
                    {formatCurrency(totalValue60 + totalValue100)}
                </span>
                <TrendIndicator direction={dashboardTrends.vTotal} />
             </div>
          </div>
        </div>

      </div>

      {/* Chart Section - Hours */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-6 flex items-center gap-2">
          <BarChartIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          Horas por Setor (60% vs 100%)
        </h3>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <defs>
                <linearGradient id="grad60" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_60} stopOpacity={1}>
                     <animate attributeName="stop-color" values={`${COLOR_60};${COLOR_60_ALT};${COLOR_60}`} dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor={COLOR_60} stopOpacity={0.6}>
                     <animate attributeName="stop-color" values={`${COLOR_60};${COLOR_60_ALT};${COLOR_60}`} dur="4s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
                <linearGradient id="grad100" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_100} stopOpacity={1}>
                     <animate attributeName="stop-color" values={`${COLOR_100};${COLOR_100_ALT};${COLOR_100}`} dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor={COLOR_100} stopOpacity={0.6}>
                     <animate attributeName="stop-color" values={`${COLOR_100};${COLOR_100_ALT};${COLOR_100}`} dur="4s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
                {/* Hover Shadow Filter */}
                <filter id="barShadow" height="130%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="2" dy="2" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                  </feComponentTransfer>
                  <feMerge> 
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" /> 
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                interval={0} 
                tick={{ fontSize: 12, fill: axisTextColor }}
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: axisTextColor }}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: cursorFill, opacity: cursorOpacity }} 
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                wrapperStyle={{ color: legendTextColor }}
              />
              
              <Bar 
                name="Horas 60%" 
                dataKey="hours60" 
                stackId="a" 
                fill="url(#grad60)" 
                stroke={COLOR_60}
                radius={[0, 0, 0, 0]}
                cursor="pointer"
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
                activeBar={{ 
                    fill: "url(#grad60)", 
                    stroke: COLOR_60, 
                    strokeWidth: 3, 
                    filter: 'url(#barShadow)',
                    opacity: 1
                }}
              >
              </Bar>
              <Bar 
                name="Horas 100%" 
                dataKey="hours100" 
                stackId="a" 
                fill="url(#grad100)" 
                stroke={COLOR_100}
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                isAnimationActive={true}
                animationBegin={200} 
                animationDuration={1000}
                animationEasing="ease-out"
                activeBar={{ 
                    fill: "url(#grad100)", 
                    stroke: COLOR_100, 
                    strokeWidth: 3, 
                    filter: 'url(#barShadow)',
                    opacity: 1
                }}
              >
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Section - Financial Values */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          Valor das Horas Extras por Setor
        </h3>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <defs>
                <linearGradient id="gradMoney60" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_60} stopOpacity={1}>
                     <animate attributeName="stop-color" values={`${COLOR_60};${COLOR_60_ALT};${COLOR_60}`} dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor={COLOR_60} stopOpacity={0.6}>
                     <animate attributeName="stop-color" values={`${COLOR_60};${COLOR_60_ALT};${COLOR_60}`} dur="4s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
                <linearGradient id="gradMoney100" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_100} stopOpacity={1}>
                     <animate attributeName="stop-color" values={`${COLOR_100};${COLOR_100_ALT};${COLOR_100}`} dur="4s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor={COLOR_100} stopOpacity={0.6}>
                     <animate attributeName="stop-color" values={`${COLOR_100};${COLOR_100_ALT};${COLOR_100}`} dur="4s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                interval={0} 
                tick={{ fontSize: 12, fill: axisTextColor }}
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: axisTextColor }}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: cursorFill, opacity: cursorOpacity }} 
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                wrapperStyle={{ color: legendTextColor }}
              />
              
              <Bar 
                name="Valor 60%" 
                dataKey="value60" 
                stackId="b" 
                fill="url(#gradMoney60)" 
                stroke={COLOR_60}
                radius={[0, 0, 0, 0]}
                cursor="pointer"
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
                activeBar={{ 
                    fill: "url(#gradMoney60)", 
                    stroke: COLOR_60, 
                    strokeWidth: 3, 
                    filter: 'url(#barShadow)',
                    opacity: 1
                }}
              >
              </Bar>
              <Bar 
                name="Valor 100%" 
                dataKey="value100" 
                stackId="b" 
                fill="url(#gradMoney100)" 
                stroke={COLOR_100}
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                isAnimationActive={true}
                animationBegin={200} 
                animationDuration={1000}
                animationEasing="ease-out"
                activeBar={{ 
                    fill: "url(#gradMoney100)", 
                    stroke: COLOR_100, 
                    strokeWidth: 3, 
                    filter: 'url(#barShadow)',
                    opacity: 1
                }}
              >
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Chart Section - Line Chart (Last 3 Months Trend) */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          Evolução dos Últimos 3 Meses (Último Dia)
        </h3>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: axisTextColor }}
              />
              <YAxis 
                hide={true}
                tick={{ fontSize: 12, fill: axisTextColor }}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: gridColor, strokeWidth: 1 }} 
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                wrapperStyle={{ color: legendTextColor }}
              />
              
              <Line 
                name="Horas 60%" 
                type="monotone" 
                dataKey="hours60" 
                stroke={COLOR_60} 
                strokeWidth={3}
                dot={{ r: 4, fill: COLOR_60, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                isAnimationActive={true}
              >
                  <LabelList 
                    dataKey="hours60" 
                    position="top" 
                    formatter={(val: number) => formatDecimalToTime(val)} 
                    style={{ fill: COLOR_60, fontSize: 11, fontWeight: 'bold' }} 
                    offset={10}
                  />
              </Line>
              <Line 
                name="Horas 100%" 
                type="monotone" 
                dataKey="hours100" 
                stroke={COLOR_100} 
                strokeWidth={3}
                dot={{ r: 4, fill: COLOR_100, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                isAnimationActive={true}
              >
                 <LabelList 
                    dataKey="hours100" 
                    position="top" 
                    formatter={(val: number) => formatDecimalToTime(val)} 
                    style={{ fill: COLOR_100, fontSize: 11, fontWeight: 'bold' }} 
                    offset={10}
                  />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};