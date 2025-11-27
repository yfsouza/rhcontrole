
import React from 'react';
import { Eraser } from 'lucide-react';
import { FilterState } from '../types';

// VIEW: Filter inputs and buttons

interface FilterBarProps {
  filters: FilterState;
  availableYears: string[];
  availableMonths: string[];
  availableDays: string[];
  availableSectors: string[];
  userAllowedSector?: string; // New prop to handle visibility of 'Todos'
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  availableYears, 
  availableMonths, 
  availableDays, 
  availableSectors,
  userAllowedSector,
  onFilterChange, 
  onClear 
}) => {
  const isSectorRestricted = userAllowedSector && userAllowedSector !== 'TODOS';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 transition-colors">
      <div className="flex flex-col md:flex-row gap-4 items-end w-full">
        
        {/* Name Search - Expanded to max width */}
        <div className="w-full md:flex-1">
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Filtro por colaborador</label>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            placeholder="Nome ou parte do nome"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          />
        </div>

        {/* Year Dropdown */}
        <div className="w-full md:w-32">
           <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Ano</label>
           <select
             className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
             value={filters.year}
             onChange={(e) => onFilterChange('year', e.target.value)}
           >
             <option value="Todos">Todos</option>
             {availableYears.map(year => (
               <option key={year} value={year}>{year}</option>
             ))}
           </select>
        </div>

        {/* Month Dropdown */}
        <div className="w-full md:w-40">
           <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Mês</label>
           <select
             className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
             value={filters.month}
             onChange={(e) => onFilterChange('month', e.target.value)}
           >
             <option value="Todos">Todos</option>
             {availableMonths.map(monthIndex => (
               <option key={monthIndex} value={monthIndex}>
                 {MONTH_NAMES[parseInt(monthIndex)]}
               </option>
             ))}
           </select>
        </div>

        {/* Day Dropdown - 'Todos' removed */}
        <div className="w-full md:w-24">
           <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Dia</label>
           <select
             className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
             value={filters.day}
             onChange={(e) => onFilterChange('day', e.target.value)}
           >
             {availableDays.map(day => (
               <option key={day} value={day}>{day}</option>
             ))}
           </select>
        </div>

        {/* Sector Dropdown (formerly Status) */}
        <div className="w-full md:w-40">
           <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Setor</label>
           <select
             className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
             value={filters.sector}
             onChange={(e) => onFilterChange('sector', e.target.value)}
             disabled={!!isSectorRestricted} // Disable interaction if restricted
           >
             {/* Only show 'Todos' if user is not restricted */}
             {!isSectorRestricted && <option value="Todos">Todos</option>}
             
             {availableSectors.map(sector => (
               <option key={sector} value={sector}>{sector}</option>
             ))}
           </select>
        </div>

        {/* Action Buttons - Circular Icon Button with Enhanced Animation */}
        
      </div>
    </div>
  );
};
