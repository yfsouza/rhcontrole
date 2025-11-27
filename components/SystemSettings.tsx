// components/SystemSettings.tsx
import React, { useState } from 'react';
import { Save, Bell, Mail, Shield, Database, Users } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: 'Sua Empresa',
    systemEmail: 'sistema@empresa.com',
    backupTime: '02:00',
    sessionTimeout: 60,
    notifications: {
      email: true,
      system: true,
      backup: true
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configurações do Sistema</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure as preferências e comportamentos do sistema
          </p>
        </div>

        {/* Configurações Gerais */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Configurações Gerais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome da Empresa
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email do Sistema
              </label>
              <input
                type="email"
                value={settings.systemEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, systemEmail: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Horário do Backup
              </label>
              <input
                type="time"
                value={settings.backupTime}
                onChange={(e) => setSettings(prev => ({ ...prev, backupTime: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeout de Sessão (minutos)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-500" />
            Notificações
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notificações por Email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receber alertas e relatórios por email
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notificações do Sistema</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Alertas internos do sistema
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.system}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, system: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Alertas de Backup</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notificações sobre status dos backups
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.backup}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, backup: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="p-6">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};