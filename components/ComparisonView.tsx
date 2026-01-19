
import React from 'react';
import { marked } from 'marked';
import { Exploration } from '../types';
import { calculateTargets } from '../utils/calculations';
import { LifestyleGuide } from './LifestyleGuide';
import { COUNTRIES } from '../data/facts';

interface ComparisonViewProps {
  explorations: Exploration[];
  onExit: () => void;
}

const ExplorationColumn: React.FC<{ exploration: Exploration }> = ({ exploration }) => {
  const { personalTarget, isImpossible } = calculateTargets(exploration);
  const country = COUNTRIES.find(c => c.code === exploration.countryCode);
  const activeChanges = Object.entries(exploration.structuralChanges)
    .filter(([, value]) => value)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col gap-6">
      <h3 className="text-2xl font-bold text-center text-slate-900">{exploration.name}</h3>

      <div className="border border-slate-200 rounded-lg p-4">
        <h4 className="text-lg font-bold text-slate-800 mb-3 text-center">Scenario Parameters</h4>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex justify-between">
            <span className="font-medium">Country:</span>
            <span>{country?.name || 'N/A'}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Initial Emissions:</span>
            <span>{country ? `${country.emissions.toFixed(1)} tonnes` : 'N/A'}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Participation Rate:</span>
            <span>{exploration.participationRate}%</span>
          </li>
          <li className="flex flex-col">
            <span className="font-medium mb-1">Structural Changes:</span>
            {activeChanges.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {activeChanges.map(change => (
                  <span key={change} className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-xs font-semibold">{change}</span>
                ))}
              </div>
            ) : (
              <span className="text-slate-500 italic">None applied</span>
            )}
          </li>
        </ul>
      </div>

      <div className="text-center bg-slate-100 p-4 rounded-lg">
        {isImpossible ? (
          <>
            <p className="text-3xl font-bold text-rose-600 my-2">Impossible Goal</p>
            <p className="text-slate-700 mt-1">This scenario is not viable.</p>
          </>
        ) : (
          <>
            <p className="text-slate-700">Personal Target:</p>
            <p className="text-4xl font-bold text-teal-600 my-2">{personalTarget.toFixed(1)} tonnes</p>
          </>
        )}
      </div>

      {!isImpossible && <LifestyleGuide target={personalTarget} />}

      <div>
        <h4 className="text-xl font-bold text-center text-slate-900 mb-4">Generated Stories</h4>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {exploration.stories.length > 0 ? exploration.stories.map(story => (
              <div key={story.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm font-semibold px-2 py-1 bg-teal-100 text-teal-800 rounded mb-2 inline-block">{story.genre}</span>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(story.text) as string }} />
              </div>
            )) : <p className="text-center text-slate-500 py-4">No stories generated.</p>}
        </div>
      </div>
    </div>
  );
};

export const ComparisonView: React.FC<ComparisonViewProps> = ({ explorations, onExit }) => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Comparison View</h1>
        <p className="mt-3 text-lg text-slate-600">Comparing {explorations.length} climate scenarios.</p>
        <button onClick={onExit} className="mt-6 bg-teal-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-teal-700 transition-colors">
          ← Back to Editor
        </button>
      </header>
      <main className={`grid grid-cols-1 lg:grid-cols-${explorations.length} gap-8 items-start`}>
        {explorations.map(exp => (
          <ExplorationColumn key={exp.id} exploration={exp} />
        ))}
      </main>
    </div>
  );
};
