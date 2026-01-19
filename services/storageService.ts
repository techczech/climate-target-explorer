
import { Exploration } from '../types';

const LOCAL_STORAGE_KEY = 'climateExplorations';
const SCHEMA_VERSION = 1;

interface ExportData {
  version: number;
  data: Exploration[];
  exportedAt: string;
}

const validateExploration = (item: any): item is Exploration => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.participationRate === 'number' &&
    typeof item.structuralChanges === 'object' &&
    Array.isArray(item.stories)
  );
};

export const storageService = {
  save(explorations: Exploration[]) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(explorations));
    } catch (error) {
      console.error("Storage Save Error:", error);
    }
  },

  load(): Exploration[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every(validateExploration)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error("Storage Load Error:", error);
      return [];
    }
  },

  exportToFile(explorations: Exploration[]) {
    const exportPayload: ExportData = {
      version: SCHEMA_VERSION,
      data: explorations,
      exportedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(exportPayload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `climate-explorations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async importFromFile(file: File): Promise<Exploration[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result;
          if (typeof text !== 'string') throw new Error("File content is not text");
          
          const json = JSON.parse(text);
          
          // Handle both raw array (legacy) and new object format
          let dataToValidate: any[] = [];
          if (Array.isArray(json)) {
            dataToValidate = json;
          } else if (json.data && Array.isArray(json.data)) {
            dataToValidate = json.data;
          } else {
            throw new Error("Invalid file structure");
          }

          if (dataToValidate.every(validateExploration)) {
            resolve(dataToValidate);
          } else {
            reject(new Error("File contains invalid exploration data"));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }
};
