import { HrRecord } from '../types';
import * as XLSX from 'xlsx';
import { supabase } from './supabase';

// MODEL/SERVICE: Handles data retrieval and authentication via Supabase

export interface ActiveRegisteredRecord {
  id: string;
  sector: string;
}

interface FetchResult {
  records: HrRecord[];
  isOffline: boolean;
  activeRegisteredRecords: ActiveRegisteredRecord[];
}

export interface UserSession {
  username: string;
  name: string;
  jobTitle: string; 
  allowedSector: string;
  lastAccess?: string;
  role: 'admin' | 'manager' | 'user'; // Nova propriedade adicionada
}

// Helper to abbreviate sector names
export const abbreviateSector = (name: string): string => {
  if (!name) return '';
  const cleanName = name.trim().toUpperCase();
  const parts = cleanName.split(/\s+/); 
  
  if (parts.length > 1) {
    const firstWord = parts[0];
    if (firstWord.length > 3) {
      return `${firstWord.substring(0, 3)}. ${parts.slice(1).join(' ')}`;
    }
  }
  return cleanName;
};

// --- AUTHENTICATION (SUPABASE) ---

export const verifyCredentials = async (username: string, password: string): Promise<UserSession | null> => {
  try {
    const normalizeUser = username.trim().toUpperCase();
    
    // Query Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', normalizeUser)
      .maybeSingle();

    if (error) {
        console.error("Supabase Auth Error:", error);
        return null;
    }

    if (data && data.password === password) {
      // Update Last Access Date
      const now = new Date().toLocaleString('pt-BR');
      
      // Fire and forget update
      await supabase
        .from('users')
        .update({ access_data: now })
        .eq('id', data.id);

      const rawAuthorized = String(data.allowed_sector || 'TODOS').trim();
      const allowedSector = rawAuthorized.toUpperCase() === 'TODOS' ? 'TODOS' : abbreviateSector(rawAuthorized);

      // Determinar role baseado no username ou dados do banco
      const determineRole = (): 'admin' | 'manager' | 'user' => {
        const userRole = data.role || data.role_name;
        
        if (userRole) {
          if (userRole.toLowerCase().includes('admin')) return 'admin';
          if (userRole.toLowerCase().includes('manager') || userRole.toLowerCase().includes('gerente')) return 'manager';
          return 'user';
        }
        
        // Fallback baseado no username (para compatibilidade)
        if (normalizeUser === 'ADMIN') return 'admin';
        if (normalizeUser === 'GERENTE' || normalizeUser.includes('GERENTE')) return 'manager';
        return 'user';
      };

      return {
        username: data.username,
        name: data.name || data.username,
        jobTitle: data.job_title || 'Colaborador',
        allowedSector: allowedSector,
        lastAccess: data.access_data,
        role: determineRole() // Nova propriedade
      };
    }
    return null;
  } catch (e) {
    console.error("Network Error during auth:", e);
    return null;
  }
};

// Update Password
export const updatePassword = async (username: string, newPassword: string): Promise<boolean> => {
  try {
    const normalizeUser = username.trim().toUpperCase();
    
    const { error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('username', normalizeUser);

    if (error) {
        console.error("Supabase Update Error:", error);
        return false;
    }
    return true;
  } catch (e) {
    console.error("Network Error during password update:", e);
    return false;
  }
};

// --- HR DATA FETCHING (Existing Logic) ---

// Helper: Calculate trends based on previous day
const calculateTrends = (records: HrRecord[]): HrRecord[] => {
  const empMap = new Map<string, HrRecord[]>();
  
  records.forEach(r => {
    if (!empMap.has(r.employeeId)) {
      empMap.set(r.employeeId, []);
    }
    empMap.get(r.employeeId)!.push(r);
  });

  empMap.forEach((empRecords) => {
    empRecords.sort((a, b) => a.excelDate - b.excelDate);

    for (let i = 1; i < empRecords.length; i++) {
      const current = empRecords[i];
      const prev = empRecords[i - 1];

      const curr60 = current.hours60 || 0;
      const prev60 = prev.hours60 || 0;
      if (curr60 > prev60) current.trend60 = 'up';
      else if (curr60 < prev60) current.trend60 = 'down';
      else current.trend60 = 'equal';

      const curr100 = current.hours100 || 0;
      const prev100 = prev.hours100 || 0;
      if (curr100 > prev100) current.trend100 = 'up';
      else if (curr100 < prev100) current.trend100 = 'down';
      else current.trend100 = 'equal';
    }
  });

  return records;
};

const parseCurrency = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  const str = String(value).trim();
  const cleanStr = str.replace(/[R$\s.]/g, '').replace(',', '.');
  const result = parseFloat(cleanStr);
  return isNaN(result) ? 0 : result;
};

export const fetchHrData = async (): Promise<FetchResult> => {
  try {
    const [hrResponse, cadastroResponse] = await Promise.all([
      fetch('Dados/HRAP001.xlsx'),
      fetch('Dados/Cadastro.xlsx')
    ]);
    
    const activeRegisteredRecords: ActiveRegisteredRecord[] = [];

    if (!hrResponse.ok) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ records: [], isOffline: true, activeRegisteredRecords: [] });
        }, 500);
      });
    }

    const hrArrayBuffer = await hrResponse.arrayBuffer();
    const hrWorkbook = XLSX.read(hrArrayBuffer, { type: 'array' });
    const hrSheetName = hrWorkbook.SheetNames.find(name => name.toLowerCase() === 'dados') || hrWorkbook.SheetNames[0];
    const hrWorksheet = hrWorkbook.Sheets[hrSheetName];
    const hrJsonData = XLSX.utils.sheet_to_json<any>(hrWorksheet);

    const locationMap = new Map<string, string>();
    const salaryMap = new Map<string, number>();
    
    if (cadastroResponse.ok) {
      try {
        const cadArrayBuffer = await cadastroResponse.arrayBuffer();
        const cadWorkbook = XLSX.read(cadArrayBuffer, { type: 'array' });
        const cadSheetName = cadWorkbook.SheetNames[0];
        const cadWorksheet = cadWorkbook.Sheets[cadSheetName];
        const cadJsonData = XLSX.utils.sheet_to_json<any>(cadWorksheet);

        cadJsonData.forEach(row => {
          const id = String(row['Cadastro'] || row['cadastro'] || '').trim();
          const rawLocation = String(row['Descrição do Local'] || row['Descricao do Local'] || row['descricao do local'] || '').trim();
          const situacao = String(row['Situação'] || row['Situacao'] || row['situacao'] || '').trim();
          const rawSalary = row['Valor Salário'] || row['Valor Salario'] || row['valor salario'] || 0;

          const abbreviatedLocation = abbreviateSector(rawLocation);
          const salary = parseCurrency(rawSalary);

          if (id) {
            if (rawLocation) locationMap.set(id, abbreviatedLocation);
            salaryMap.set(id, salary);
          }

          if (id && !['007', '7', '07'].includes(situacao)) {
            activeRegisteredRecords.push({
              id,
              sector: abbreviatedLocation
            });
          }
        });
      } catch (e) {
        console.warn('Erro processando Cadastro.xlsx', e);
      }
    }

    let records: HrRecord[] = hrJsonData.map((row, index) => {
      const empId = String(row['Cadastro'] || row['cadastro'] || '').trim(); 
      
      return {
        id: String(index),
        excelDate: row['Data'] || row['data'] || 0,
        employeeId: empId,
        name: String(row['Nome'] || row['nome'] || '').toUpperCase(),
        hours100: (typeof row['Hrs 100%'] === 'number') ? row['Hrs 100%'] : (typeof row['Horas 100%'] === 'number' ? row['Horas 100%'] : null),
        hours60: (typeof row['Hrs 60%'] === 'number') ? row['Hrs 60%'] : (typeof row['Horas 60%'] === 'number' ? row['Horas 60%'] : 0),
        locationDescription: locationMap.get(empId) || '',
        salary: salaryMap.get(empId) || 0,
        status: (row['Status'] === 'Inativo' || row['Status'] === 'inactive') ? 'inactive' : 'active'
      };
    });

    records = calculateTrends(records);

    return { records, isOffline: false, activeRegisteredRecords };

  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { records: [], isOffline: true, activeRegisteredRecords: [] };
  }
};