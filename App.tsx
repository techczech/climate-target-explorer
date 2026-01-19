import React, { useState, useMemo, useCallback } from 'react';
import { useExplorations } from './hooks/useExplorations';
import { Exploration, GeneratedStory } from './types';
import { COUNTRIES, OVERALL_TARGET } from './constants';
import { calculateTargets } from './utils/calculations';
import { ExplorationManager } from './components/ExplorationManager';
import { Controls } from './components/Controls';
import { LifestyleGuide } from './components/LifestyleGuide';
import { FutureImaginator } from './components/FutureImaginator';
import { ComparisonView } from './components/ComparisonView';

const TargetDisplay: React.FC = () => (
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 mb-8">
    <h2 className="text-xl font-bold text-center text-slate-900 mb-4">The 1.5°C Lifestyle Target</h2>
    <div className="flex justify-center mb-6">
      <div className="target-circle bg-teal-500 text-white shadow-md flex flex-col justify-center items-center w-40 h-40 rounded-full transition-transform duration-300 hover:scale-105">
        <span className="text-5xl font-bold">{OVERALL_TARGET}</span>
        <span className="text-lg">tonnes CO₂e/year</span>
      </div>
    </div>
    <p className="text-slate-700 leading-relaxed text-center max-w-xl mx-auto">
      This represents the global average "lifestyle" carbon footprint of <strong>{OVERALL_TARGET} tonnes CO₂e per person, per year by 2030</strong> required to keep global warming below 1.5°C.
    </p>
  </div>
);

const App: React.FC = () => {
  const {
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
  } = useExplorations();

  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find(c => c.code === activeExploration.countryCode);
  }, [activeExploration.countryCode]);

  const { structurallyAdjustedEmissions, personalTarget, isImpossible } = useMemo(() => {
    return calculateTargets(activeExploration);
  }, [activeExploration]);

  const handleExplorationChange = (updatedData: Partial<Exploration>) => {
    if (updatedData.countryCode && !activeExploration.countryCode) {
      const country = COUNTRIES.find(c => c.code === updatedData.countryCode);
      const isDefaultName = activeExploration.name.startsWith('My First Exploration') || activeExploration.name.startsWith('Exploration ');
      if (country && isDefaultName) {
        const newName = `${country.name} @ ${activeExploration.participationRate}%`;
        updateExplorationName(activeExploration.id, newName);
      }
    }
    updateActiveExploration(updatedData);
  };

  const handleAddStory = useCallback((storyData: Omit<GeneratedStory, 'id' | 'createdAt'>) => {
      if (!activeExploration) return;
      const newStory: GeneratedStory = {
          ...storyData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
      };
      addStoryToExploration(activeExploration.id, newStory);
  }, [activeExploration, addStoryToExploration]);
  
  const handleDeleteStory = useCallback((storyId: string) => {
      if (!activeExploration) return;
      deleteStoryFromExploration(activeExploration.id, storyId);
  }, [activeExploration, deleteStoryFromExploration]);
  
  const handleAddToCompare = useCallback((id: string) => {
    setComparisonIds(prev => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 explorations at a time.");
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const handleRemoveFromCompare = useCallback((id: string) => {
    setComparisonIds(prev => prev.filter(compId => compId !== id));
  }, []);

  const handleClearCompare = useCallback(() => {
    setComparisonIds([]);
  }, []);

  const handleStartComparison = useCallback(() => {
    if (comparisonIds.length >= 2) {
      setIsComparing(true);
    }
  }, [comparisonIds.length]);


  const explorationsToCompare = useMemo(() => 
    comparisonIds.map(id => explorations.find(e => e.id === id)).filter(Boolean) as Exploration[], 
    [comparisonIds, explorations]
  );

  if (isComparing) {
    return <ComparisonView explorations={explorationsToCompare} onExit={() => setIsComparing(false)} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Collective Climate Target</h1>
        <p className="mt-3 text-lg text-slate-600">Explore the path to a 1.5°C-compatible lifestyle.</p>
      </header>
      
      <main>
        <ExplorationManager
          explorations={explorations}
          activeExplorationId={activeExploration.id}
          comparisonIds={comparisonIds}
          onSelect={setActiveExplorationId}
          onAddToCompare={handleAddToCompare}
          onRemoveFromCompare={handleRemoveFromCompare}
          onClearCompare={handleClearCompare}
          onStartComparison={handleStartComparison}
          onCreate={createNewExploration}
          onDelete={deleteExploration}
          onImport={importExplorations}
          onExport={exportExplorations}
          onNameChange={updateExplorationName}
        />

        <TargetDisplay />

        <Controls
          activeExploration={activeExploration}
          onExplorationChange={handleExplorationChange}
          selectedCountry={selectedCountry}
          structurallyAdjustedEmissions={structurallyAdjustedEmissions}
        />

        {selectedCountry && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mt-8 border border-slate-200 fade-in">
            <h2 className="text-xl font-bold text-center text-slate-900 mb-2">4. The Collective Action Result</h2>
            <p className="text-center text-slate-600 mb-6">
              If only {activeExploration.participationRate}% of people in {selectedCountry.name} participate after structural changes, their new individual target must be:
            </p>
            {isImpossible ? (
              <div className="text-center bg-rose-100 p-4 rounded-lg border border-rose-200">
                <p className="text-3xl font-bold text-rose-600 my-2">Impossible Goal</p>
                <p className="text-slate-700 mt-1">The goal can't be met, highlighting the need for higher participation or more systemic change.</p>
              </div>
            ) : (
              <div className="text-center bg-slate-100 p-4 rounded-lg">
                <p className="text-4xl font-bold text-teal-600 my-2">{personalTarget.toFixed(1)} tonnes</p>
                <p className="text-slate-600">to keep the global average on track.</p>
              </div>
            )}
          </div>
        )}

        {selectedCountry && !isImpossible && (
          <div className="mt-8 fade-in">
            <LifestyleGuide target={personalTarget} />
            <FutureImaginator 
              countryName={selectedCountry.name} 
              personalTarget={personalTarget}
              stories={activeExploration.stories || []}
              onAddStory={handleAddStory}
              onDeleteStory={handleDeleteStory}
              key={activeExploration.id}
            />
          </div>
        )}

        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>This is a simplified tool for educational purposes, inspired by systems thinking in climate communication.</p>
          <p>Data is illustrative and based on various public sources for consumption-based emissions.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;