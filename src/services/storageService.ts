import type { CVData } from '../types';

const STORAGE_KEY = 'cv-data';
const BACKUP_KEY = 'cv-data-backup';

// Salva i dati del CV
export const saveCV = async (data: CVData): Promise<boolean> => {
  try {
    // Crea backup prima di salvare
    const currentData = localStorage.getItem(STORAGE_KEY);
    if (currentData) {
      localStorage.setItem(BACKUP_KEY, currentData);
    }

    // Salva i nuovi dati con timestamp
    const dataToSave = {
      data,
      timestamp: Date.now(),
      version: 1
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('✅ Dati CV salvati:', new Date().toLocaleTimeString());
    return true;
  } catch (error) {
    console.error('❌ Errore salvataggio:', error);
    return false;
  }
};

// Carica i dati del CV
export const loadCV = async (): Promise<CVData | null> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.log('📭 Nessun dato salvato trovato');
      return null;
    }

    const parsed = JSON.parse(stored);
    
    // Gestisce sia il nuovo formato (con metadata) che il vecchio
    if (parsed.data && parsed.timestamp) {
      console.log('📥 Dati CV caricati:', new Date(parsed.timestamp).toLocaleTimeString());
      return parsed.data as CVData;
    } else {
      // Formato vecchio, migralo
      console.log('🔄 Migrazione formato dati...');
      await saveCV(parsed as CVData);
      return parsed as CVData;
    }
  } catch (error) {
    console.error('❌ Errore caricamento:', error);
    
    // Prova a caricare il backup
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup) {
        console.log('🔄 Caricamento backup...');
        const parsed = JSON.parse(backup);
        return parsed.data || parsed;
      }
    } catch (backupError) {
      console.error('❌ Errore caricamento backup:', backupError);
    }
    
    return null;
  }
};

// Esporta dati in file JSON
export const exportCVToFile = (data: CVData, filename?: string): void => {
  const exportData = {
    data,
    timestamp: Date.now(),
    version: 1,
    exportedBy: 'CV Builder'
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `cv-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Importa dati da file JSON
export const importCVFromFile = (file: File): Promise<CVData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        // Valida la struttura
        const cvData = parsed.data || parsed;
        if (cvData.title && cvData.sections && Array.isArray(cvData.sections)) {
          resolve(cvData as CVData);
        } else {
          reject(new Error('File non valido: manca title o sections'));
        }
      } catch (error) {
        reject(new Error('File JSON non valido'));
      }
    };
    
    reader.onerror = () => reject(new Error('Errore lettura file'));
    reader.readAsText(file);
  });
};

// Cancella tutti i dati
export const clearAllData = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    console.log('🗑️ Tutti i dati cancellati');
    return true;
  } catch (error) {
    console.error('❌ Errore cancellazione:', error);
    return false;
  }
};

// Forza il salvataggio immediato (per debug)
export const forceSave = (data: CVData): void => {
  saveCV(data).then(success => {
    if (success) {
      console.log('💾 Salvataggio forzato completato');
    } else {
      console.error('❌ Salvataggio forzato fallito');
    }
  });
};