
import { useState, useEffect, useCallback } from 'react';
import { Exploration, GeneratedStory } from '../types';
import { storageService } from '../services/storageService';

const createDefaultExploration = (): Exploration => ({
  id: crypto.randomUUID(),
  name: 'My First Exploration',
  countryCode: null,
  structuralChanges: { grid: false, transport: false, food: false },
  participationRate: 50,
  createdAt: Date.now(),
  stories: [],
});

export const useExplorations = () => {
  const [explorations, setExplorations] = useState<Exploration[]>([]);
  const [activeExplorationId, setActiveExplorationId] = useState<string | null>(null);

  // Initial Load
  useEffect(() => {
    const loaded = storageService.load();
    if (loaded.length > 0) {
      setExplorations(loaded);
      setActiveExplorationId(loaded[0].id);
    } else {
      const defaultExp = createDefaultExploration();
      setExplorations([defaultExp]);
      setActiveExplorationId(defaultExp.id);
    }
  }, []);

  // Persistence
  useEffect(() => {
    if (explorations.length > 0) {
      storageService.save(explorations);
    }
  }, [explorations]);

  const activeExploration = explorations.find(e => e.id === activeExplorationId) || explorations[0] || createDefaultExploration();

  const updateActiveExploration = useCallback((updatedData: Partial<Exploration>) => {
    setExplorations(prev =>
      prev.map(exp =>
        exp.id === activeExplorationId ? { ...exp, ...updatedData } : exp
      )
    );
  }, [activeExplorationId]);
  
  const updateExplorationName = useCallback((id: string, newName: string) => {
    setExplorations(prev =>
      prev.map(exp =>
        exp.id === id ? { ...exp, name: newName } : exp
      )
    );
  }, []);

  const createNewExploration = useCallback(() => {
    const newExploration: Exploration = {
      ...createDefaultExploration(),
      name: `Exploration ${explorations.length + 1}`
    };
    setExplorations(prev => [...prev, newExploration]);
    setActiveExplorationId(newExploration.id);
  }, [explorations.length]);

  const deleteExploration = useCallback((id: string) => {
    setExplorations(prev => {
      const newExplorations = prev.filter(exp => exp.id !== id);
      if (activeExplorationId === id) {
        setActiveExplorationId(newExplorations.length > 0 ? newExplorations[0].id : null);
      }
      if (newExplorations.length === 0) {
        const defaultExp = createDefaultExploration();
        setActiveExplorationId(defaultExp.id);
        return [defaultExp];
      }
      return newExplorations;
    });
  }, [activeExplorationId]);

  const addStoryToExploration = useCallback((explorationId: string, story: GeneratedStory) => {
    setExplorations(prev =>
      prev.map(exp =>
        exp.id === explorationId ? { ...exp, stories: [...(exp.stories || []), story] } : exp
      )
    );
  }, []);

  const deleteStoryFromExploration = useCallback((explorationId: string, storyId: string) => {
    setExplorations(prev =>
      prev.map(exp =>
        exp.id === explorationId
          ? { ...exp, stories: exp.stories.filter(s => s.id !== storyId) }
          : exp
      )
    );
  }, []);

  const importExplorations = useCallback(async (file: File) => {
    try {
      const imported = await storageService.importFromFile(file);
      setExplorations(imported);
      setActiveExplorationId(imported[0]?.id || null);
    } catch (error) {
      console.error("Import failed:", error);
      alert("Failed to import explorations. Please check the file format.");
    }
  }, []);

  const exportExplorations = useCallback(() => {
    storageService.exportToFile(explorations);
  }, [explorations]);

  return {
    explorations,
    activeExploration,
    setActiveExplorationId,
    updateActiveExploration,
    createNewExploration,
    deleteExploration,
    importExplorations,
    exportExplorations,
    updateExplorationName,
    addStoryToExploration,
    deleteStoryFromExploration,
  };
};
