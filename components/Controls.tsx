
import React from 'react';
import { Exploration, Country } from '../types';
import { COUNTRIES } from '../data/facts';

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, checked, onChange }) => (
  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
    <span className="font-medium text-slate-700">{label}</span>
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        id={id} 
        className="sr-only peer" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
    </label>
  </div>
);

interface ControlsProps {
  activeExploration: Exploration;
  onExplorationChange: (updatedData: Partial<Exploration>) => void;
  selectedCountry: Country | undefined;
  structurallyAdjustedEmissions: number;
}

export const Controls: React.FC<ControlsProps> = ({ 
  activeExploration, 
  onExplorationChange,
  selectedCountry,
  structurallyAdjustedEmissions
}) => {
  const handleStructuralChange = (change: 'grid' | 'transport' | 'food', value: boolean) => {
    onExplorationChange({
      structuralChanges: {
        ...activeExploration.structuralChanges,
        [change]: value,
      },
    });
  };

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
        <h2 className="text-xl font-bold text-center text-slate-900 mb-6">1. Select a Starting Point</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <label htmlFor="country-select" className="font-medium">Average footprint for:</label>
          <select
            id="country-select"
            value={activeExploration.countryCode ?? ''}
            onChange={(e) => onExplorationChange({ countryCode: e.target.value })}
            className="bg-slate-100 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full sm:w-auto p-2.5"
          >
            <option value="">Choose a country</option>
            {COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>{country.name}</option>
            ))}
          </select>
        </div>
        {selectedCountry && (
          <div className="mt-6 text-center bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-lg">The average footprint in <strong>{selectedCountry.name}</strong> is about <strong className="text-rose-600 text-xl">{selectedCountry.emissions}</strong> tonnes per person.</p>
          </div>
        )}
      </div>

      {selectedCountry && (
        <>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mt-8 border border-slate-200 fade-in">
            <h2 className="text-xl font-bold text-center text-slate-900 mb-2">2. Apply Structural Changes</h2>
            <p className="text-center text-slate-600 mb-6">Systemic changes can dramatically lower the starting footprint for everyone. Toggle them on to see the effect.</p>
            <div className="space-y-3">
              <ToggleSwitch id="toggle-grid" label="Decarbonize the Grid" checked={activeExploration.structuralChanges.grid} onChange={(val) => handleStructuralChange('grid', val)} />
              <ToggleSwitch id="toggle-transport" label="Electrify Transport" checked={activeExploration.structuralChanges.transport} onChange={(val) => handleStructuralChange('transport', val)} />
              <ToggleSwitch id="toggle-food" label="Sustainable Food Systems" checked={activeExploration.structuralChanges.food} onChange={(val) => handleStructuralChange('food', val)} />
            </div>
            <div className="mt-6 text-center bg-slate-100 p-4 rounded-lg">
              <p className="text-slate-700">With these changes, the new average footprint becomes:</p>
              <p className="text-3xl font-bold text-green-600 my-2">{structurallyAdjustedEmissions.toFixed(1)} tonnes</p>
            </div>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mt-8 border border-slate-200 fade-in">
            <h2 className="text-xl font-bold text-center text-slate-900 mb-2">3. Set Participation Rate</h2>
            <p className="text-center text-slate-600 mb-6">What happens if not everyone participates? This shows how the burden on participants changes.</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <label htmlFor="participation-slider" className="font-medium">Participation Rate:</label>
              <span className="font-bold text-teal-600 text-lg w-16 text-center">{activeExploration.participationRate}%</span>
            </div>
            <input 
              type="range" 
              id="participation-slider" 
              min="1" 
              max="100" 
              value={activeExploration.participationRate} 
              onChange={(e) => onExplorationChange({ participationRate: parseInt(e.target.value)})}
              className="w-full"
            />
          </div>
        </>
      )}
    </>
  );
};
