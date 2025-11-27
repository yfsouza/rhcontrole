import React from 'react';
import { FileText, Moon, Sun, Cloud, Star, LogOut } from 'lucide-react';
import { UserSession } from '../services/dataService';

// VIEW: Presentation component for the header

interface HeaderProps {
  lastUpdated: Date;
  loading: boolean;
  darkMode: boolean;
  onToggleTheme: () => void;
  user: UserSession | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lastUpdated, loading, darkMode, onToggleTheme, user, onLogout }) => {
  return (
    <div className="relative overflow-visible bg-[#2D89C8] text-white p-6 rounded-t-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-4 mb-6 transition-colors dark:bg-[#1a5b8a] z-20">
      
      {/* Left Section: Logo & Title */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="bg-white/20 p-3 rounded-full shrink-0">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">Painel RH – Controle de Horas</h1>
          <p className="text-sm text-blue-100 mt-1">
            Dados carregados automaticamente do arquivo <span className="font-semibold">HRAP001.xlsx</span> no servidor.
          </p>
        </div>
      </div>
      
      {/* Right Section: User Info & Controls */}
      <div className="flex items-center gap-4 self-end md:self-auto">
        
        {/* User Info Styled Card */}
        <div className="flex items-center gap-3 bg-slate-900/30 backdrop-blur-sm border border-white/10 p-3 rounded-xl shadow-lg relative group/card min-w-[200px]">
            
             {/* Tooltip for Last Access */}
            <div className="absolute -bottom-8 right-0 opacity-0 group-hover/card:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-30">
                Último acesso: {user?.lastAccess || 'Primeiro acesso'}
            </div>

            {/* Text Info + Toggle Column */}
            <div className="flex flex-col items-end flex-grow">
                <div className="font-bold text-white text-sm uppercase tracking-wide text-right">
                    {user?.name}
                </div>
                {user?.jobTitle && (
                    <span className="text-[10px] text-blue-100 opacity-80 font-medium uppercase tracking-wider text-right mb-1">
                        {user.jobTitle}
                    </span>
                )}
                
                {/* Theme Toggle Button (Positioned below Job Title) */}
                <button
                    onClick={onToggleTheme}
                    className={`
                        relative h-5 w-10 rounded-full cursor-pointer transition-all duration-500 ease-in-out
                        border shadow-[inset_0_1px_2px_rgba(0,0,0,0.4),_0_1px_0px_rgba(255,255,255,0.2)]
                        ${darkMode 
                            ? 'border-slate-600 bg-slate-900' 
                            : 'border-blue-300 bg-cyan-200'
                        }
                    `}
                    title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
                >
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                            <div className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="absolute top-0.5 right-1.5 text-yellow-100 opacity-60"><Star className="w-1 h-1 fill-current" /></div>
                                <div className="absolute bottom-0.5 right-3 text-yellow-100 opacity-40"><Star className="w-0.5 h-0.5 fill-current" /></div>
                            </div>
                            <div className={`absolute inset-0 transition-opacity duration-500 ${!darkMode ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="absolute top-0.5 left-1.5 text-white opacity-80"><Cloud className="w-1.5 h-1.5 fill-current" /></div>
                            </div>
                        </div>

                        <div
                            className={`
                                absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-sm
                                flex items-center justify-center transition-all duration-500 cubic-bezier(0.68, -0.6, 0.32, 1.6)
                                border-[1.5px] z-10
                                ${darkMode 
                                    ? 'left-0.5 bg-slate-800 border-slate-700' 
                                    : 'left-[calc(100%-1.1rem)] bg-yellow-400 border-yellow-200'
                                }
                            `}
                        >
                            {darkMode ? (
                                    <Moon className="w-2 h-2 text-indigo-300 fill-indigo-300" />
                            ) : (
                                    <Sun className="w-2.5 h-2.5 text-orange-100 fill-orange-100" />
                            )}
                        </div>
                </button>
            </div>

            {/* Logout Button */}
            <div className="h-full border-l border-white/10 pl-3 ml-1">
                <button 
                    onClick={onLogout}
                    className="
                      group/logout relative 
                      w-10 h-10 rounded-full 
                      flex items-center justify-center 
                      bg-slate-800/50 border border-white/10 text-gray-300
                      shadow-sm
                      transition-all duration-300 ease-out
                      hover:bg-red-900/50 hover:border-red-500 hover:text-red-200 hover:shadow-lg hover:shadow-red-900/20 hover:-translate-y-1
                      active:translate-y-0 active:shadow-none active:scale-90
                    "
                    title="Sair do sistema"
                >
                    <LogOut className="w-5 h-5 transition-transform duration-300 group-hover/logout:-rotate-12 group-hover/logout:scale-110 group-active/logout:rotate-45" />
                </button>
            </div>
        </div>

      </div>

      {/* Loading Progress Bar */}
      {loading && (
        <>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-800/30 z-10 overflow-hidden rounded-b-lg">
            <div 
              className="h-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.7)]"
              style={{
                width: '40%',
                animation: 'indeterminate-progress 1.5s infinite linear'
              }}
            />
          </div>
          <style>{`
            @keyframes indeterminate-progress {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(350%); }
            }
          `}</style>
        </>
      )}
    </div>
  );
};