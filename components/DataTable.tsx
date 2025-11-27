
import React from 'react';
import { HrRecord, SortConfig } from '../types';
import { SearchX, AlertCircle, ArrowUp, ArrowDown, ChevronUp, ChevronDown } from 'lucide-react';

// VIEW: The table displaying records

interface DataTableProps {
  data: HrRecord[];
  loading: boolean;
  isOffline?: boolean;
  sortConfig: SortConfig;
  onSort: (key: keyof HrRecord) => void;
}

// Helper: Convert Excel Serial Date to dd/mm/yyyy
const formatExcelDate = (serial: number): string => {
  if (!serial) return '';
  const date = new Date((serial - 25569) * 86400 * 1000);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
};

// Helper: Convert Excel Decimal Time to hh:mm
const formatExcelTime = (decimal: number | null): string => {
  if (decimal === null || decimal === undefined) return '';
  const totalMinutes = Math.round(decimal * 24 * 60);
  // Hide 00:00 by returning empty string
  if (totalMinutes === 0) return '';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Helper Component for Trend Icon
const TrendIcon: React.FC<{ direction?: 'up' | 'down' | 'equal' }> = ({ direction }) => {
  if (direction === 'up') {
    return (
      <span title="Acrescentou">
        <ArrowUp className="w-4 h-4 text-red-500 stroke-[3]" />
      </span>
    );
  }
  if (direction === 'down') {
    return (
      <span title="Reduziu">
        <ArrowDown className="w-4 h-4 text-green-500 stroke-[3]" />
      </span>
    );
  }
  if (direction === 'equal') {
    return (
      <span title="Manteve" className="flex items-center justify-center w-4 h-4">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
      </span>
    );
  }
  
  // Return a placeholder to ensure the text column stays aligned even if no trend icon is present (e.g. first record)
  return <div className="w-4 h-4" />;
};

export const DataTable: React.FC<DataTableProps> = ({ data, loading, isOffline, sortConfig, onSort }) => {
  // Filter out rows where both hours are effectively zero (formatted as empty string)
  const visibleData = data.filter(record => {
    const time60 = formatExcelTime(record.hours60);
    const time100 = formatExcelTime(record.hours100);
    // Only show row if at least one of the columns has a non-zero value
    return time60 !== '' || time100 !== '';
  });

  const SortIcon = ({ columnKey }: { columnKey: keyof HrRecord }) => {
    const isActive = sortConfig.key === columnKey;
    return (
      <div className="flex flex-col leading-none mr-2">
        <ChevronUp 
            className={`w-4 h-4 -mb-1.5 transition-colors ${isActive && sortConfig.direction === 'asc' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}`} 
        />
        <ChevronDown 
            className={`w-4 h-4 transition-colors ${isActive && sortConfig.direction === 'desc' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}`} 
        />
      </div>
    );
  };

  const renderSortableHeader = (label: string, columnKey: keyof HrRecord, align: 'left' | 'right' = 'left') => (
    <th 
      className={`px-6 py-2 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none transition-colors ${align === 'right' ? 'text-right' : 'text-left'}`}
      onClick={() => onSort(columnKey)}
      title="Pressione para Ordenar"
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {/* Icon placed BEFORE the label */}
        <SortIcon columnKey={columnKey} />
        <span>{label}</span>
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-colors">
      <div className="overflow-auto max-h-[600px]">
        <table className="min-w-full text-left text-sm relative">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-2 font-semibold text-gray-700 dark:text-gray-300 w-24">Data</th>
              {renderSortableHeader("Nome", "name")}
              {renderSortableHeader("Hrs 60%", "hours60", "right")}
              {renderSortableHeader("Hrs 100%", "hours100", "right")}
              {renderSortableHeader("Setor", "locationDescription")}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {visibleData.length === 0 ? (
               <tr>
                 <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                   {isOffline ? (
                     <div className="flex flex-col items-center gap-2 text-red-500 opacity-80">
                        <AlertCircle className="w-8 h-8" />
                        <span>Não foi possível carregar os dados. Verifique se o arquivo HRAP001.xlsx está presente na pasta Dados.</span>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-2 opacity-60">
                        <SearchX className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                        <span className="font-medium">Nenhum registro encontrado com os filtros atuais.</span>
                     </div>
                   )}
                 </td>
               </tr>
            ) : (
                visibleData.map((record) => {
                  const time60 = formatExcelTime(record.hours60);
                  const time100 = formatExcelTime(record.hours100);

                  return (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-2 text-gray-600 dark:text-gray-300">
                          {formatExcelDate(record.excelDate)}
                        </td>
                        <td className="px-6 py-2 text-gray-800 dark:text-gray-100 uppercase">{record.name}</td>
                        
                        {/* Hrs 60% with Trend */}
                        <td className="px-6 py-2 text-gray-700 dark:text-gray-200 font-bold">
                          <div className="flex items-center justify-end gap-2">
                            <span>{time60}</span>
                            {/* Only show trend icon if there is time data */}
                            {time60 && <TrendIcon direction={record.trend60} />}
                          </div>
                        </td>

                        {/* Hrs 100% with Trend */}
                        <td className="px-6 py-2 text-gray-700 dark:text-gray-200 font-bold">
                           <div className="flex items-center justify-end gap-2">
                            <span>{time100}</span>
                            {/* Only show trend icon if there is time data */}
                            {time100 && <TrendIcon direction={record.trend100} />}
                           </div>
                        </td>

                        <td className="px-6 py-2 text-gray-600 dark:text-gray-300">
                          {record.locationDescription}
                        </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
