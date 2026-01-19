import { useState, useEffect, useCallback } from 'react';
import { Exploration, GeneratedStory } from '../types';

const LOCAL_STORAGE_KEY = 'climateExplorations';

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

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      const items = storedItems ? JSON.parse(storedItems) : [];
      if (items.length > 0) {
        setExplorations(items);
        setActiveExplorationId(items[0].id);
      } else {
        const defaultExploration = createDefaultExploration();
        setExplorations([defaultExploration]);
        setActiveExplorationId(defaultExploration.id);
      }
    } catch (error) {
      console.error("Failed to load explorations from local storage", error);
      const defaultExploration = createDefaultExploration();
      setExplorations([defaultExploration]);
      setActiveExplorationId(defaultExploration.id);
    }
  }, []);

  useEffect(() => {
    if (explorations.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(explorations));
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


  const importExplorations = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') throw new Error("File content is not a string");
        const imported = JSON.parse(text);
        if (Array.isArray(imported)) { // Add more robust validation here if needed
          setExplorations(imported);
          setActiveExplorationId(imported[0]?.id || null);
        }
      } catch (error) {
        console.error("Failed to import explorations:", error);
        alert("Invalid file format. Please upload a valid explorations JSON file.");
      }
    };
    reader.readAsText(file);
  }, []);

  const exportExplorations = useCallback(() => {
    const dataStr = JSON.stringify(explorations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `climate-explorations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
