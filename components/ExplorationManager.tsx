
import React, { useState, useMemo, useRef } from 'react';
import { Exploration } from '../types';
import { COUNTRIES } from '../data/facts';

interface ExplorationManagerProps {
  explorations: Exploration[];
  activeExplorationId: string;
  comparisonIds: string[];
  onSelect: (id: string) => void;
  onAddToCompare: (id: string) => void;
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onStartComparison: () => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onNameChange: (id: string, newName: string) => void;
}

const getCountryName = (code: string | null) => COUNTRIES.find(c => c.code === code)?.name || 'N/A';

export const ExplorationManager: React.FC<ExplorationManagerProps> = ({
  explorations,
  activeExplorationId,
  comparisonIds,
  onSelect,
  onAddToCompare,
  onRemoveFromCompare,
  onClearCompare,
  onStartComparison,
  onCreate,
  onDelete,
  onNameChange,
  onImport,
  onExport,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) { 
      onImport(file); 
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEdit = (exploration: Exploration) => {
    setEditingId(exploration.id);
    setEditingName(exploration.name);
  };
  
  const handleSaveName = (id: string) => {
    if (editingName.trim()) {
      onNameChange(id, editingName.trim());
    }
    setEditingId(null);
  };

  const filteredExplorations = useMemo(() => {
    return explorations.filter(exp => 
      !filterCountry || exp.countryCode === filterCountry
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [explorations, filterCountry]);

  const selectedForComparison = useMemo(() => {
    return comparisonIds.map(id => explorations.find(e => e.id === id)).filter(Boolean) as Exploration[];
  }, [comparisonIds, explorations]);

  return (
    <div className="bg-slate-100 rounded-2xl mb-8 border border-slate-200 transition-all duration-300">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">My Explorations Dashboard</h2>
        <span className="text-2xl text-slate-500 transform transition-transform">{isExpanded ? '−' : '+'}</span>
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0">
          <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-slate-200">
            <button onClick={onCreate} className="bg-teal-600 text-white hover:bg-teal-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
              + New Exploration
            </button>
            <div className="flex-grow"></div>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2"
            >
              <option value="">Filter by country...</option>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
            <button onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Import</button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
            <button onClick={onExport} className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Export</button>
          </div>
          
          {comparisonIds.length > 0 && (
            <div className="p-3 mb-4 bg-teal-50 border border-teal-200 rounded-lg fade-in">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-teal-800">Comparison Queue ({comparisonIds.length}/3)</h3>
                <div className="flex items-center">
                  <button onClick={onStartComparison} disabled={comparisonIds.length < 2} className="bg-teal-600 text-white hover:bg-teal-700 font-semibold py-1.5 px-4 rounded-lg text-sm transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                    Compare
                  </button>
                  <button onClick={onClearCompare} className="ml-3 text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors">Clear</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedForComparison.map(exp => (
                  <div key={exp.id} className="bg-white px-2 py-1 rounded-md text-sm text-slate-700 border border-slate-200 flex items-center gap-1.5">
                    <span>{exp.name}</span>
                    <button onClick={() => onRemoveFromCompare(exp.id)} className="text-slate-400 hover:text-rose-500 font-bold leading-none text-lg -mt-0.5">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {filteredExplorations.map(exp => {
              const isSelectedForCompare = comparisonIds.includes(exp.id);
              return (
              <div key={exp.id} className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${exp.id === activeExplorationId ? 'bg-teal-50 border border-teal-200' : 'bg-white'}`}>
                <input type="radio" name="active-exploration" checked={exp.id === activeExplorationId} onChange={() => onSelect(exp.id)} className="form-radio h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500 flex-shrink-0"/>
                
                <div className="flex-grow">
                  {editingId === exp.id ? (
                    <input 
                      type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)}
                      className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 p-1 w-full"
                      onBlur={() => handleSaveName(exp.id)} onKeyDown={(e) => e.key === 'Enter' && handleSaveName(exp.id)} autoFocus
                    />
                  ) : (
                    <p className="font-medium text-slate-800">{exp.name}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    {getCountryName(exp.countryCode)} &middot; {exp.participationRate}% Participation
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(exp)} title="Edit name" className="p-2 text-slate-500 hover:text-slate-800 transition-colors text-lg leading-none">✏️</button>
                  <button onClick={() => onDelete(exp.id)} disabled={explorations.length <= 1} title="Delete" className="p-2 text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg leading-none">🗑️</button>
                  <button 
                    onClick={() => onAddToCompare(exp.id)} 
                    disabled={isSelectedForCompare || comparisonIds.length >= 3} 
                    className={`text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors w-36 text-center ${
                      isSelectedForCompare 
                      ? 'bg-teal-100 text-teal-800 cursor-default' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isSelectedForCompare ? '✓ Added' : '+ Add to Compare'}
                  </button>
                </div>
              </div>
            )})}
          </div>
          {filteredExplorations.length === 0 && <p className="text-center text-slate-500 py-4">No explorations match your filter.</p>}
        </div>
      )}
    </div>
  );
};
