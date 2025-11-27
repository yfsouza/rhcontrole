// App.tsx
import React, { useEffect, useState } from 'react';

import { LayoutDashboard, Table, Settings, Users, Database as DbIcon, Home } from 'lucide-react';

import { UserSession } from './services/dataService';

import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { FilterBar } from './components/FilterBar';
import { StatusBar } from './components/StatusBar';
import { Dashboard } from './components/Dashboard';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { DataTable } from './components/DataTable';
import { DatabaseManagement } from './components/DatabaseManagement';
import { UserManagement } from './components/UserManagement';
import { SystemSettings } from './components/SystemSettings';
import MainMenu from './components/MainMenu';
import Pginfoperacional from './Pginfoperacional';
import Footer from './components/Footer';

import { FilterState, HrRecord, DashboardChartData, DashboardTrends, TrendData } from './types';

type View =
  | 'menu'
  | 'dashboard'
  | 'tabela'
  | 'executivo'
  | 'database'
  | 'users'
  | 'settings'
  | 'operacional';

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState<View>('menu');

  // ======== ESTADOS DO PAINEL ============
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    year: 'Todos',
    month: 'Todos',
    day: '',
    sector: 'Todos',
  });

  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const [tableData, setTableData] = useState<HrRecord[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardChartData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [trends, setTrends] = useState<DashboardTrends>({
    hTotal: null,
    vTotal: null,
  });

  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [sortConfig, setSortConfig] = useState({ key: 'excelDate', direction: 'desc' } as any);

  // ======== DARK MODE ============
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ======== LOGIN ============
  const handleLoginSuccess = (u: UserSession) => {
    setUser(u);
    setView('menu');
  };

  const handleLogout = () => {
    setUser(null);
    setView('menu');
  };

  // ======== FILTROS ============
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      year: 'Todos',
      month: 'Todos',
      day: '',
      sector: 'Todos',
    });
  };

  // ======== ORDENAR TABELA ============
  const handleSort = (key: keyof HrRecord) => {
    setSortConfig((prev: any) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // =============================================================
  // =============== RENDER PRINCIPAL =============================
  // =============================================================

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* HEADER */}
      <Header
        lastUpdated={lastUpdated}
        loading={loading}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((p) => !p)}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto gap-4 px-4 pb-6">
        {/* MENU LATERAL */}
        <aside className="w-56 shrink-0 mt-2">
          <nav className="space-y-2">
            {[
              { key: 'menu', icon: Home, label: 'Início' },
              { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Horas' },
              { key: 'tabela', icon: Table, label: 'Tabela de Horas' },
              { key: 'executivo', icon: LayoutDashboard, label: 'Painel Executivo' },
              { key: 'database', icon: DbIcon, label: 'Banco de Dados' },
              { key: 'users', icon: Users, label: 'Usuários' },
              { key: 'settings', icon: Settings, label: 'Configurações' },
              { key: 'operacional', icon: LayoutDashboard, label: 'Informação Operacional' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setView(key as View)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${
                    view === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTEÚDO */}
        <main className="flex-1 mt-2 space-y-4">
          {/* StatusBar para dashboards */}
          {(view === 'dashboard' || view === 'tabela') && (
            <StatusBar totalCount={totalCount} filteredCount={filteredCount} isOffline={isOffline} />
          )}

          {/* Barra de Filtros */}
          {(view === 'dashboard' || view === 'tabela') && (
            <FilterBar
              filters={filters}
              availableYears={availableYears}
              availableMonths={availableMonths}
              availableDays={availableDays}
              availableSectors={availableSectors}
              userAllowedSector={user.allowedSector}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          )}

          {/* Início (MainMenu) */}
          {view === 'menu' && (
            <MainMenu onGoToOperacional={() => setView('operacional')} />
          )}

          {/* Dashboard Horas */}
          {view === 'dashboard' && (
            <Dashboard
              data={dashboardData}
              trendData={trendData}
              dashboardTrends={trends}
              totalCollaborators={filteredCount}
              totalRegisteredActive={totalCount}
              totalValue60={0}
              totalValue100={0}
              loading={loading}
              darkMode={darkMode}
            />
          )}

          {/* Tabela */}
          {view === 'tabela' && (
            <DataTable
              data={tableData}
              loading={loading}
              isOffline={isOffline}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          )}

          {/* Painel Executivo */}
          {view === 'executivo' && <ExecutiveDashboard darkMode={darkMode} />}

          {view === 'operacional' && (
            <Pginfoperacional
              user={user}          // passa o usuário logado
              onLogout={handleLogout} // reuse a mesma função de logout do Header
            />
          )}

          {/* Banco de Dados */}
          {view === 'database' && <DatabaseManagement />}

          {/* Usuários */}
          {view === 'users' && <UserManagement />}

          {/* Configurações */}
          {view === 'settings' && <SystemSettings />}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default App;
