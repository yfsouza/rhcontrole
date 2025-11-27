// src/Pginfoperacional.tsx
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Table as TableIcon, RefreshCw } from 'lucide-react';

import { useHrController } from './hooks/useHrController';
import { TabType } from './types';
import { UserSession } from './services/dataService';

import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { StatusBar } from './components/StatusBar';
import { DataTable } from './components/DataTable';
import { Dashboard } from './components/Dashboard';

interface PginfoperacionalProps {
  user: UserSession;
  onLogout: () => void;
}

const Pginfoperacional: React.FC<PginfoperacionalProps> = ({ user, onLogout }) => {
  const {
    data,
    dashboardData,
    lastDayTrendData,
    loading,
    isOffline,
    lastUpdated,
    filters,
    totalCount,
    filteredCount,
    uniqueCollaborators,
    totalRegisteredActive,
    totalValue60,
    totalValue100,
    dashboardTrends,
    availableYears,
    availableMonths,
    availableDays,
    availableSectors,
    sortConfig,
    handleFilterChange,
    handleSort,
    clearFilters,
    reloadData
  } = useHrController(user); // já passa o usuário autenticado

  const [activeTab, setActiveTab] = useState<TabType>('data');

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply Theme Class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-300">
      <Header
        lastUpdated={lastUpdated}
        loading={loading}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">

        {/* Título + botão recarregar */}
        <div className="p-6 pb-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Informação Operacional - Planilha de Dados
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Exibindo automaticamente a aba <span className="font-semibold text-gray-700 dark:text-gray-300">Dados</span> (se existir) ou a primeira aba da planilha. 
                Os filtros abaixo também afetam o painel.
              </p>
            </div>
            <button
              onClick={reloadData}
              disabled={loading}
              className="bg-[#2D89C8] hover:bg-blue-600 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Recarregar arquivo
            </button>
          </div>

          {/* Filtros */}
          <FilterBar
            filters={filters}
            availableYears={availableYears}
            availableMonths={availableMonths}
            availableDays={availableDays}
            availableSectors={availableSectors}
            userAllowedSector={user.allowedSector}
            onFilterChange={handleFilterChange}
            onClear={clearFilters}
          />
        </div>

        {/* Abas Data / Dashboard */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mt-4">
          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 py-4 text-center font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'data'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            Planilha de Dados
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-4 text-center font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Painel
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 min-h-[600px] transition-colors duration-300">
          {activeTab === 'data' ? (
            <>
              <StatusBar
                totalCount={totalCount}
                filteredCount={filteredCount}
                isOffline={isOffline}
              />

              <DataTable
                data={data}
                loading={loading}
                isOffline={isOffline}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </>
          ) : (
            <Dashboard
              data={dashboardData}
              trendData={lastDayTrendData}
              loading={loading}
              totalCollaborators={uniqueCollaborators}
              totalRegisteredActive={totalRegisteredActive}
              totalValue60={totalValue60}
              totalValue100={totalValue100}
              dashboardTrends={dashboardTrends}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pginfoperacional;
