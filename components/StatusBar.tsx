import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

// VIEW: Displays system status and row counts

interface StatusBarProps {
  totalCount: number;
  filteredCount: number;
  isOffline: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ totalCount, filteredCount, isOffline }) => {
  return (
    <div className={`border rounded p-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm transition-colors ${
        isOffline 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900' 
            : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {isOffline ? (
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-full text-xs font-bold w-fit">
            <AlertCircle className="w-3 h-3" />
            Offline
          </span>
        ) : (
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full text-xs font-bold w-fit">
            <CheckCircle className="w-3 h-3" />
            Online
          </span>
        )}
        
        <span className={isOffline ? 'text-red-700 dark:text-red-300 font-medium' : 'text-gray-500 dark:text-gray-400'}>
          {isOffline 
            ? "Arquivo HRAP001.xlsx não encontrado." 
            : "Arquivo carregado com sucesso. Aba exibida: HoraDiaria"
          }
        </span>
      </div>
      
      {!isOffline && (
        <div className="text-right text-gray-500 dark:text-gray-400">
          Total de Registros da Planilha: <span className="font-medium text-gray-700 dark:text-gray-200">{totalCount}</span> - Após Filtros: <span className="font-medium text-gray-700 dark:text-gray-200">{filteredCount}</span>
        </div>
      )}
    </div>
  );
};