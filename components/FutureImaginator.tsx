
import React, { useState, useCallback } from 'react';
import { marked } from 'marked';
import { generateStory } from '../services/geminiService';
import { GeneratedStory } from '../types';

interface FutureImaginatorProps {
  countryName: string;
  personalTarget: number;
  stories: GeneratedStory[];
  onAddStory: (story: Omit<GeneratedStory, 'id' | 'createdAt'>) => void;
  onDeleteStory: (storyId: string) => void;
}

export const FutureImaginator: React.FC<FutureImaginatorProps> = ({ countryName, personalTarget, stories, onAddStory, onDeleteStory }) => {
  const [genre, setGenre] = useState('Hopeful Solarpunk');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateStory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const prompt = `You are a ${genre} author. Write a short story (around 300-400 words) set in ${countryName}. The story must reflect a world where the average person's lifestyle has a carbon footprint of ${personalTarget.toFixed(1)} tonnes. The story should be engaging and subtly incorporate details specific to ${countryName}'s culture or geography. The story must reveal what this society is like through its characters, setting, and plot, exploring aspects like how they travel, what they eat, what they value, and their relationship with technology and community. Do not explicitly mention "carbon footprints", "tonnes of CO2", or climate change jargon. Show, don't tell the reader about this lifestyle.`;

    try {
      const generatedText = await generateStory(prompt);
      onAddStory({
        prompt,
        text: generatedText,
        genre,
      });
    } catch (e) {
      // FIX: Update error message to not mention API keys, as per Gemini API guidelines.
      setError('Sorry, there was an error imagining this future. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [genre, countryName, personalTarget, onAddStory]);

  const handleCopy = (story: GeneratedStory) => {
    // FIX: Use marked.parseSync for synchronous conversion.
    // FIX: The method `parseSync` does not exist on the imported `marked` object. Using `marked.parse` instead.
    const plainText = new DOMParser().parseFromString(marked.parse(story.text), 'text/html').body.textContent || "";
    navigator.clipboard.writeText(plainText);
    setCopiedId(story.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mt-8 border border-slate-200">
      <h2 className="text-xl font-bold text-center text-slate-900 mb-2">Imagine the Future</h2>
      <p className="text-center text-slate-600 mb-6">Translate this target number into a vision of society. Generate one or more stories to explore the possibilities.</p>
      
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full sm:w-auto p-2.5">
            <option>Hopeful Solarpunk</option><option>Sci-Fi</option><option>Social Drama</option><option>Alternate History</option><option>Children's Tale</option>
          </select>
          <button onClick={handleGenerateStory} disabled={isLoading} className="bg-teal-600 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto">
            {isLoading ? 'Imagining...' : '+ Generate New Story'}
          </button>
        </div>
        {error && <div className="text-center text-red-500 mt-3">{error}</div>}
      </div>

      <div className="mt-6 space-y-4">
        {stories.length > 0 ? stories.map(story => (
          <div key={story.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold px-2 py-1 bg-teal-100 text-teal-800 rounded">{story.genre}</span>
                <div>
                  <button onClick={() => handleCopy(story)} className="text-sm font-medium text-slate-500 hover:text-teal-600 mr-2">{copiedId === story.id ? 'Copied!' : 'Copy'}</button>
                  <button onClick={() => onDeleteStory(story.id)} className="text-sm font-medium text-rose-500 hover:text-rose-700">Delete</button>
                </div>
            </div>
            {/* FIX: Use marked.parseSync for synchronous conversion needed by React. */}
            {/* FIX: The method `parseSync` does not exist on the imported `marked` object. Using `marked.parse` instead. */}
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(story.text) }} />
          </div>
        )) : (
          <div className="text-center text-slate-500 py-8">
            <p>Your generated stories will appear here.</p>
          </div>
        )}
        {isLoading && <div className="text-center text-slate-500 p-4">✨ Thinking about a brighter future...</div>}
      </div>
    </div>
  );
};