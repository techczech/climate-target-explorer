
import { Country, LifestyleTier } from '../types';

export const COUNTRIES: Country[] = [
  { code: 'USA', name: 'United States', emissions: 16.1 },
  { code: 'AUS', name: 'Australia', emissions: 14.9 },
  { code: 'CAN', name: 'Canada', emissions: 14.2 },
  { code: 'DEU', name: 'Germany', emissions: 8.1 },
  { code: 'JPN', name: 'Japan', emissions: 8.0 },
  { code: 'CHN', name: 'China', emissions: 7.7 },
  { code: 'GBR', name: 'United Kingdom', emissions: 5.5 },
  { code: 'FRA', name: 'France', emissions: 5.3 },
  { code: 'SWE', name: 'Sweden', emissions: 4.7 },
  { code: 'WLD', name: 'World Average', emissions: 4.6 },
];

export const LIFESTYLE_DATA: LifestyleTier[] = [
  {
    threshold: 1.0,
    title: "Extreme",
    data: {
      food: ['Strictly vegan diet', 'Hyper-local & homegrown food', 'Zero food waste'],
      mobility: ['No flights', 'Completely car-free living', 'Radically local life'],
      home: ['Off-grid or equivalent energy', 'Minimalist/smaller living spaces', 'Minimal hot water use'],
      stuff: ['Consumption moratorium (buy almost nothing new)', 'Radical repair & community sharing'],
    }
  },
  {
    threshold: 2.5,
    title: "Ambitious",
    data: {
      food: ['Plant-rich diet (minimal meat/dairy)', 'Low food waste', 'Local & seasonal sourcing'],
      mobility: ['Mostly flight-free', 'Car-free or very low use', 'Prioritize public/active transport'],
      home: ['100% renewable electricity tariff', 'High-efficiency, well-insulated home', 'Sufficient, not excessive, space'],
      stuff: ['Drastically reduce new purchases', 'Repair & reuse first', 'Second-hand as a default'],
    }
  },
  {
    threshold: 5.0,
    title: "Moderate",
    data: {
      food: ['Less & better meat (e.g., chicken over beef)', 'Conscious of food waste', 'Buy local when possible'],
      mobility: ['One short-haul flight every few years', 'Drive an efficient EV/hybrid mindfully', 'Use public transport for commutes'],
      home: ['Energy-saving habits', 'Ensure good home insulation', 'Switch to a green energy tariff'],
      stuff: ['Buy durable goods, not disposable', 'Limit fast fashion', 'Active recycling'],
    }
  },
  {
    threshold: Infinity,
    title: "High (Efficiency Focus)",
    data: {
      food: ['Reduce beef intake', 'Buy in bulk to reduce packaging', 'Choose sustainable seafood'],
      mobility: ['Offset flights', 'Drive an EV or Hybrid', 'Combine trips to be more efficient'],
      home: ['Use smart home tech for efficiency', 'Install solar panels', 'LED lighting throughout'],
      stuff: ['Recycle electronics & clothing', 'Choose brands with sustainability goals', 'Avoid single-use plastics'],
    }
  }
];
