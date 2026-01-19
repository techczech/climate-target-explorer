
import React, { useMemo } from 'react';
import { LIFESTYLE_DATA } from '../data/facts';
import { LifestyleCategory } from '../types';

interface LifestyleGuideProps {
  target: number;
}

const categoryStyles: Record<LifestyleCategory, { pill: string; border: string }> = {
  food: { pill: 'bg-green-100 text-green-800 border-green-200', border: 'border-green-300' },
  mobility: { pill: 'bg-blue-100 text-blue-800 border-blue-200', border: 'border-blue-300' },
  home: { pill: 'bg-yellow-100 text-yellow-800 border-yellow-200', border: 'border-yellow-300' },
  stuff: { pill: 'bg-purple-100 text-purple-800 border-purple-200', border: 'border-purple-300' },
};

const categoryHeadings: Record<LifestyleCategory, string> = {
  food: 'Food',
  mobility: 'Mobility',
  home: 'Home & Energy',
  stuff: 'Consumption ("Stuff")',
};

export const LifestyleGuide: React.FC<LifestyleGuideProps> = ({ target }) => {
  const lifestyleTier = useMemo(() => {
    return LIFESTYLE_DATA.find(tier => target <= tier.threshold) || LIFESTYLE_DATA[LIFESTYLE_DATA.length - 1];
  }, [target]);

  const lifestyleData = lifestyleTier.data;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mt-8 border border-slate-200">
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
        What Does a <span className="text-teal-600">{target.toFixed(1)}</span>-Tonne Lifestyle Look Like?
      </h2>
      <p className="text-center text-slate-600 mb-8">This is a <strong className="text-slate-800">{lifestyleTier.title}</strong> level of ambition, requiring choices like:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(lifestyleData).map(key => {
          const category = key as LifestyleCategory;
          return (
            <div key={category} className={`bg-white p-5 rounded-xl shadow-md border-2 ${categoryStyles[category].border} flex flex-col`}>
              <h3 className="text-lg font-bold text-slate-800 mb-4">{categoryHeadings[category]}</h3>
              <div className="flex flex-wrap gap-2 flex-grow items-start">
                {lifestyleData[category].map(item => (
                  <span key={item} className={`text-sm font-medium px-3 py-1.5 rounded-full border ${categoryStyles[category].pill}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
