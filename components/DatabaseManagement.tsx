// components/DatabaseManagement.tsx
import React, { useState } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';

export const DatabaseManagement: React.FC = () => {
  const [backups, setBackups] = useState([
    {
      id: '1',
      name: 'backup_2025_11_26.sql',
      date: '26/11/2025 08:30',
      size: '2.4 MB',
      type: 'automático'
    },
    {
      id: '2', 
      name: 'backup_2025_11_25.sql',
      date: '25/11/2025 08:30',
      size: '2.3 MB',
      type: 'automático'
    }
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-500" />
            Gestão da Base de Dados
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Backup, restauração e manutenção do banco de dados
          </p>
        </div>

        {/* Ações Rápidas */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="h-5 w-5 text-green-500" />
              <span>Backup Agora</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Upload className="h-5 w-5 text-blue-500" />
              <span>Restaurar</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <RefreshCw className="h-5 w-5 text-purple-500" />
              <span>Otimizar</span>
            </button>
          </div>
        </div>

        {/* Backups */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Backups Disponíveis
          </h3>
          
          <div className="space-y-3">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Database className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{backup.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {backup.date} • {backup.size} • {backup.type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Estatísticas da Base
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">1,248</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Registros</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">142</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Colaboradores</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">24.8 MB</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tamanho</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Setores</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200">
              Backup Automático
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Backups automáticos são realizados diariamente às 02:00. 
              Certifique-se de que o sistema esteja online neste horário.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};