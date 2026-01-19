
import { Exploration } from '../types';
import { OVERALL_TARGET, FOOTPRINT_BREAKDOWN, STRUCTURAL_REDUCTION_FACTORS } from '../config/model';
import { COUNTRIES } from '../data/facts';

export function calculateTargets(exploration: Exploration) {
  const country = COUNTRIES.find(c => c.code === exploration.countryCode);

  if (!country) {
    return { structurallyAdjustedEmissions: 0, personalTarget: 0, isImpossible: false };
  }

  const initialEmissions = country.emissions;
  let reduction = 0;
  if (exploration.structuralChanges.grid) {
    reduction += initialEmissions * FOOTPRINT_BREAKDOWN.energy * STRUCTURAL_REDUCTION_FACTORS.grid;
  }
  if (exploration.structuralChanges.transport) {
    reduction += initialEmissions * FOOTPRINT_BREAKDOWN.transport * STRUCTURAL_REDUCTION_FACTORS.transport;
  }
  if (exploration.structuralChanges.food) {
    reduction += initialEmissions * FOOTPRINT_BREAKDOWN.food * STRUCTURAL_REDUCTION_FACTORS.food;
  }
  const adjusted = initialEmissions - reduction;

  const participationRate = exploration.participationRate / 100;
  // Avoid division by zero, though slider min is 1.
  const target = participationRate > 0 
    ? (OVERALL_TARGET - ((1 - participationRate) * adjusted)) / participationRate
    : Infinity;

  return {
    structurallyAdjustedEmissions: adjusted,
    personalTarget: target,
    isImpossible: target < 0,
  };
}
