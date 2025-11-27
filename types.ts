
// MODEL: Definition of data structures

export interface HrRecord {
  id: string; // Unique identifier (e.g., generated UUID)
  excelDate: number; // Raw Excel date number (e.g., 45931)
  employeeId: string; // 'Cadastro'
  name: string;
  hours100: number | null;
  hours60: number;
  locationDescription?: string; // New field from Cadastro.xlsx
  salary?: number; // New field from Cadastro.xlsx for calculations
  status: 'active' | 'inactive';
  trend60?: 'up' | 'down' | 'equal'; // New trend field
  trend100?: 'up' | 'down' | 'equal'; // New trend field
  [key: string]: any; // Allow index access for sorting
}

export interface FilterState {
  searchQuery: string;
  year: string;
  month: string;
  day: string;
  sector: string; // Changed from status to sector (based on locationDescription)
}

export interface SortConfig {
  key: keyof HrRecord | null;
  direction: 'asc' | 'desc';
}

export interface DashboardChartData {
  name: string; // Sector name
  hours60: number; // Sum of hours 60%
  hours100: number; // Sum of hours 100%
  value60: number; // Sum of value 60%
  value100: number; // Sum of value 100%
}

export interface TrendData {
  name: string; // Label (e.g. "30/09")
  hours60: number;
  hours100: number;
}

export interface DashboardTrends {
  h60: 'up' | 'down' | 'equal' | null;
  h100: 'up' | 'down' | 'equal' | null;
  v60: 'up' | 'down' | 'equal' | null;
  v100: 'up' | 'down' | 'equal' | null;
  hTotal: 'up' | 'down' | 'equal' | null;
  vTotal: 'up' | 'down' | 'equal' | null;
}

export type TabType = 'data' | 'dashboard';
