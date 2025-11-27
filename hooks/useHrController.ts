
import { useState, useEffect, useMemo, useCallback } from 'react';
import { HrRecord, FilterState, DashboardChartData, SortConfig, DashboardTrends, TrendData } from '../types';
import { fetchHrData, ActiveRegisteredRecord, UserSession } from '../services/dataService';

// CONTROLLER: Manages state, business logic, and user input handling.

// Helper: Convert Excel Serial Date to JS Date object
const excelDateToJSDate = (serial: number): Date => {
  return new Date((serial - 25569) * 86400 * 1000);
};

export const useHrController = (user: UserSession | null) => {
  const [data, setData] = useState<HrRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  // Store the full list of active registered employees from Cadastro.xlsx
  const [activeRegisteredRecords, setActiveRegisteredRecords] = useState<ActiveRegisteredRecord[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    year: 'Todos',
    month: 'Todos',
    day: '1', // Default to 1 instead of Todos
    sector: 'Todos',
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  });

  // Effect to apply User Sector Restriction on login
  useEffect(() => {
    if (user && user.allowedSector !== 'TODOS') {
        setFilters(prev => ({ ...prev, sector: user.allowedSector }));
    }
  }, [user]);

  // Initial Data Load
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { records, isOffline, activeRegisteredRecords } = await fetchHrData();
      setData(records);
      setIsOffline(isOffline);
      setActiveRegisteredRecords(activeRegisteredRecords);
      setLastUpdated(new Date());

      // Automatically set filters to the latest date found in the file
      if (records.length > 0) {
        // Find the max excelDate (handling potential 0s or nulls)
        const maxSerial = records.reduce((max, r) => (r.excelDate > max ? r.excelDate : max), 0);
        
        if (maxSerial > 0) {
          const maxDate = excelDateToJSDate(maxSerial);
          
          setFilters(prev => ({
            ...prev,
            year: maxDate.getUTCFullYear().toString(),
            month: maxDate.getUTCMonth().toString(),
            day: maxDate.getUTCDate().toString()
          }));
        }
      }

    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract unique filter options based on current selection context
  const { availableYears, availableMonths, availableDays, availableSectors } = useMemo(() => {
    const years = new Set<string>();
    const months = new Set<string>(); // Stored as index 0-11
    const days = new Set<string>();
    const sectors = new Set<string>();

    // 0. Pre-filter by User Restriction
    const userRestrictedSector = user?.allowedSector !== 'TODOS' ? user?.allowedSector : null;

    // 1. Context Data: Filter the base dataset by Name and Sector first.
    // This ensures that if we filter for "Benjamim", we only see years/months/days relevant to him.
    const contextData = data.filter(record => {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        !filters.searchQuery ||
        record.name.toLowerCase().includes(searchLower) ||
        record.employeeId.includes(filters.searchQuery);

      // Apply Filter selection OR User restriction
      const currentSectorFilter = userRestrictedSector || filters.sector;
      const matchesSector = currentSectorFilter === 'Todos' 
        ? true 
        : record.locationDescription === currentSectorFilter;

      return matchesSearch && matchesSector;
    });

    // 2. Extract Date Components from the filtered context
    contextData.forEach(record => {
      // Collect Sectors
      // If user is restricted, only add their sector. If not, add all sectors matching name search.
      if (!filters.searchQuery || 
          record.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
          record.employeeId.includes(filters.searchQuery)) {
          if (record.locationDescription) {
             if (!userRestrictedSector || record.locationDescription === userRestrictedSector) {
                 sectors.add(record.locationDescription);
             }
          }
      }

      // Collect Dates
      if (record.excelDate) {
        const date = excelDateToJSDate(record.excelDate);
        const rYear = date.getUTCFullYear().toString();
        const rMonth = date.getUTCMonth().toString();
        const rDay = date.getUTCDate().toString();

        // Available Years: All years in the filtered context (Search + Sector)
        years.add(rYear);

        // Available Months: Context + Selected Year
        const yearMatch = filters.year === 'Todos' || filters.year === rYear;
        if (yearMatch) {
          months.add(rMonth);
        }

        // Available Days: Context + Selected Year + Selected Month
        const monthMatch = filters.month === 'Todos' || filters.month === rMonth;
        if (yearMatch && monthMatch) {
          days.add(rDay);
        }
      }
    });

    return {
      availableYears: Array.from(years).sort((a, b) => b.localeCompare(a)), // Descending
      availableMonths: Array.from(months).sort((a, b) => parseInt(a) - parseInt(b)), // Ascending
      availableDays: Array.from(days).sort((a, b) => parseInt(a) - parseInt(b)), // Ascending
      availableSectors: Array.from(sectors).sort(), // Alphabetical
    };
  }, [data, filters.year, filters.month, filters.searchQuery, filters.sector, user]);

  // Filtering Logic for the Table
  const filteredData = useMemo(() => {
    let result = data.filter((record) => {
      // Name Search
      const matchesSearch = 
        record.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        record.employeeId.includes(filters.searchQuery);

      // Sector Filter - Apply strict check against User Restriction
      let matchesSector = true;
      if (user && user.allowedSector !== 'TODOS') {
        // Enforce user restriction regardless of filter state
        matchesSector = record.locationDescription === user.allowedSector;
      } else {
        // Normal filtering
        matchesSector = filters.sector === 'Todos' 
          ? true 
          : record.locationDescription === filters.sector;
      }

      // Date Filter
      let matchesDate = true;
      if (record.excelDate) {
        const date = excelDateToJSDate(record.excelDate);
        
        // Year Filter
        if (filters.year !== 'Todos' && date.getUTCFullYear().toString() !== filters.year) {
          matchesDate = false;
        }
        // Month Filter
        if (filters.month !== 'Todos' && date.getUTCMonth().toString() !== filters.month) {
          matchesDate = false;
        }
        // Day Filter (Always specific)
        if (date.getUTCDate().toString() !== filters.day) {
          matchesDate = false;
        }
      }

      return matchesSearch && matchesSector && matchesDate;
    });

    // Apply Sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const valA = a[sortConfig.key!] ?? '';
        const valB = b[sortConfig.key!] ?? '';

        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig, user]);

  // Calculate filtered count of Active Registered Employees (Cadastro.xlsx)
  const totalRegisteredActive = useMemo(() => {
    // Determine effective sector filter (User restriction overrides 'Todos')
    const effectiveSector = (user && user.allowedSector !== 'TODOS') 
        ? user.allowedSector 
        : filters.sector;

    if (effectiveSector === 'Todos') {
      return activeRegisteredRecords.length;
    }
    return activeRegisteredRecords.filter(r => r.sector === effectiveSector).length;
  }, [activeRegisteredRecords, filters.sector, user]);

  // Count unique collaborators in the filtered dataset (HRAP001.xlsx)
  const uniqueCollaborators = useMemo(() => {
    const uniqueIds = new Set<string>();
    filteredData.forEach(record => {
        if (record.employeeId) {
            uniqueIds.add(record.employeeId);
        }
    });
    return uniqueIds.size;
  }, [filteredData]);

  // Dashboard Aggregation Logic: Totals and Charts
  const { dashboardData, totalValue60, totalValue100, overallTotal60, overallTotal100 } = useMemo(() => {
    const aggMap = new Map<string, { h60: number; h100: number; v60: number; v100: number }>();
    let v60 = 0;
    let v100 = 0;
    let h60Sum = 0;
    let h100Sum = 0;

    filteredData.forEach(record => {
      // 1. Chart Data Aggregation
      const sector = record.locationDescription || 'Não informado';
      const h60 = (record.hours60 || 0) * 24; // Convert excel decimal to hours
      const h100 = (record.hours100 || 0) * 24;
      
      h60Sum += h60;
      h100Sum += h100;

      const current = aggMap.get(sector) || { h60: 0, h100: 0, v60: 0, v100: 0 };
      
      // 2. Financial Calculation
      let cost60 = 0;
      let cost100 = 0;

      if (record.salary) {
        const hourlyRate = record.salary / 220;
        // Cost = Hours * HourlyRate * OvertimeFactor
        cost60 = (h60 * hourlyRate * 1.6);
        cost100 = (h100 * hourlyRate * 2.0);
        
        v60 += cost60;
        v100 += cost100;
      }

      aggMap.set(sector, { 
        h60: current.h60 + h60, 
        h100: current.h100 + h100,
        v60: current.v60 + cost60,
        v100: current.v100 + cost100
      });
    });

    const chartData = Array.from(aggMap.entries())
      .map(([name, totals]) => ({
        name,
        hours60: parseFloat(totals.h60.toFixed(2)),
        hours100: parseFloat(totals.h100.toFixed(2)),
        value60: parseFloat(totals.v60.toFixed(2)),
        value100: parseFloat(totals.v100.toFixed(2))
      }))
      .sort((a, b) => (b.hours60 + b.hours100) - (a.hours60 + a.hours100));

    return { 
        dashboardData: chartData, 
        totalValue60: v60, 
        totalValue100: v100,
        overallTotal60: h60Sum,
        overallTotal100: h100Sum
    };

  }, [filteredData]);

  // New Trend Data Calculation: Last Day of Last 3 Months
  const lastDayTrendData: TrendData[] = useMemo(() => {
    // 0. User Restriction check
    const userRestrictedSector = user?.allowedSector !== 'TODOS' ? user?.allowedSector : null;

    // 1. Context: Filter by Sector and Name (but IGNORE Date filters)
    const contextData = data.filter(record => {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = !filters.searchQuery || record.name.toLowerCase().includes(searchLower) || record.employeeId.includes(filters.searchQuery);
      
      const currentSectorFilter = userRestrictedSector || filters.sector;
      const matchesSector = currentSectorFilter === 'Todos' ? true : record.locationDescription === currentSectorFilter;
      
      return matchesSearch && matchesSector;
    });

    // 2. Find distinct Month-Years and their max dates
    // Using Integer keys to ensure we capture the whole day regardless of time fraction
    const maxDayByMonth = new Map<string, number>(); // Key: YYYY-MM, Value: Integer ExcelDate

    contextData.forEach(r => {
      if (!r.excelDate) return;
      const d = excelDateToJSDate(r.excelDate);
      
      // CRITICAL FIX: Use UTC methods to prevent timezone shifts (e.g. Brazil -3h shifting dates back)
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`; 
      
      const daySerial = Math.floor(r.excelDate); // Normalize to integer day
      const currentMax = maxDayByMonth.get(key) || 0;
      
      if (daySerial > currentMax) {
        maxDayByMonth.set(key, daySerial);
      }
    });

    // 3. Get top 3 latest months
    const sortedTargetDays = Array.from(maxDayByMonth.values())
      .sort((a, b) => b - a) // Descending
      .slice(0, 3) // Top 3
      .sort((a, b) => a - b); // Ascending for chart

    // 4. Aggregate totals for these specific dates
    return sortedTargetDays.map(targetDaySerial => {
      const d = excelDateToJSDate(targetDaySerial);
      // Use pt-BR locale for month names if desired, here sticking to DD/MM format
      const label = `${d.getUTCDate().toString().padStart(2, '0')}/${(d.getUTCMonth() + 1).toString().padStart(2, '0')}`;

      let h60 = 0;
      let h100 = 0;

      contextData.forEach(r => {
        // Compare Integers to capture ALL records for that day, regardless of timestamp fraction
        if (Math.floor(r.excelDate) === targetDaySerial) {
           h60 += (r.hours60 || 0) * 24;
           h100 += (r.hours100 || 0) * 24;
        }
      });

      return {
        name: label,
        hours60: parseFloat(h60.toFixed(2)),
        hours100: parseFloat(h100.toFixed(2))
      };
    });

  }, [data, filters.searchQuery, filters.sector, user]);

  // Trends Calculation for Dashboard (Comparing filtered day vs previous day)
  const dashboardTrends: DashboardTrends = useMemo(() => {
    // We only calculate trend if a specific date is selected (Year, Month, Day)
    // Day is now mandatory, so we just check Year/Month
    if (filters.year === 'Todos' || filters.month === 'Todos') {
        return { h60: null, h100: null, v60: null, v100: null, hTotal: null, vTotal: null };
    }

    const currentYear = parseInt(filters.year);
    const currentMonth = parseInt(filters.month);
    const currentDay = parseInt(filters.day); // guaranteed to be a number string

    // Calculate Previous Date components
    const currDateObj = new Date(currentYear, currentMonth, currentDay);
    currDateObj.setDate(currDateObj.getDate() - 1); // Subtract 1 day
    
    const prevYear = currDateObj.getFullYear().toString();
    const prevMonth = currDateObj.getMonth().toString();
    const prevDay = currDateObj.getDate().toString();

    // Calculate totals for Previous Day
    let prevH60 = 0;
    let prevH100 = 0;
    let prevV60 = 0;
    let prevV100 = 0;
    
    // User Restriction
    const userRestrictedSector = user?.allowedSector !== 'TODOS' ? user?.allowedSector : null;

    data.forEach(record => {
        if (!record.excelDate) return;
        
        // Filter Logic applied to Previous Day
        const rDate = excelDateToJSDate(record.excelDate);
        const rYear = rDate.getUTCFullYear().toString();
        const rMonth = rDate.getUTCMonth().toString();
        const rDay = rDate.getUTCDate().toString();

        const matchesDate = rYear === prevYear && rMonth === prevMonth && rDay === prevDay;
        
        // Match Search and Sector
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch = !filters.searchQuery || record.name.toLowerCase().includes(searchLower) || record.employeeId.includes(filters.searchQuery);
        
        const currentSectorFilter = userRestrictedSector || filters.sector;
        const matchesSector = currentSectorFilter === 'Todos' ? true : record.locationDescription === currentSectorFilter;

        if (matchesDate && matchesSearch && matchesSector) {
            const h60 = (record.hours60 || 0) * 24;
            const h100 = (record.hours100 || 0) * 24;
            prevH60 += h60;
            prevH100 += h100;

            if (record.salary) {
                const hourlyRate = record.salary / 220;
                prevV60 += (h60 * hourlyRate * 1.6);
                prevV100 += (h100 * hourlyRate * 2.0);
            }
        }
    });

    // Helper to determine direction
    const getDir = (curr: number, prev: number) => {
        // Use a small epsilon for floating point comparison if needed, or simple comparison
        if (curr > prev) return 'up';
        if (curr < prev) return 'down';
        return 'equal';
    };

    const currHTotal = overallTotal60 + overallTotal100;
    const prevHTotal = prevH60 + prevH100;

    const currVTotal = totalValue60 + totalValue100;
    const prevVTotal = prevV60 + prevV100;

    return {
        h60: getDir(overallTotal60, prevH60),
        h100: getDir(overallTotal100, prevH100),
        v60: getDir(totalValue60, prevV60),
        v100: getDir(totalValue100, prevV100),
        hTotal: getDir(currHTotal, prevHTotal),
        vTotal: getDir(currVTotal, prevVTotal)
    };

  }, [data, filters, overallTotal60, overallTotal100, totalValue60, totalValue100, user]);


  // Actions
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      // Auto-reset downstream filters to prevent invalid states
      // If Year changes -> Reset Month and Day
      if (key === 'year') {
        newFilters.month = 'Todos';
        newFilters.day = '1'; // Reset Day to a valid default, not 'Todos'
      }
      // If Month changes -> Reset Day
      if (key === 'month') {
        newFilters.day = '1'; // Reset Day to a valid default, not 'Todos'
      }

      return newFilters;
    });
  };

  const handleSort = (key: keyof HrRecord) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' }; // Default to desc on first click
    });
  };

  const clearFilters = () => {
    // If user is restricted, clear sets sector to allowedSector, else Todos
    const resetSector = (user && user.allowedSector !== 'TODOS') ? user.allowedSector : 'Todos';

    // Find a valid default date if possible, or fallback to '1'
    // Ideally we reload the max date, but for simple clear we can just reset.
    // However, sticking to the logic of 'Day is always selected', '1' is safe.
    // Better yet, we should probably just reset year/month to Todos, and Day to '1', 
    // forcing the user to pick Year/Month again which will then allow them to pick a proper day.
    
    setFilters({
      searchQuery: '',
      year: 'Todos',
      month: 'Todos',
      day: '1', 
      sector: resetSector,
    });
    setSortConfig({ key: null, direction: 'asc' });
  };

  return {
    data: filteredData,
    dashboardData, 
    lastDayTrendData, 
    totalCount: data.length, 
    filteredCount: filteredData.length,
    uniqueCollaborators, 
    totalRegisteredActive,
    totalValue60, 
    totalValue100,
    dashboardTrends, 
    loading,
    isOffline,
    lastUpdated,
    filters,
    availableYears,
    availableMonths,
    availableDays,
    availableSectors,
    sortConfig, 
    handleFilterChange,
    handleSort, 
    clearFilters,
    reloadData: loadData
  };
};
