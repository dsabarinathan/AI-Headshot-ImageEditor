import React from 'react';
import { Mode } from '../types';

interface PromptSuggestionsProps {
  mode: Mode;
  onSuggestionClick: (suggestion: string) => void;
}

const generateSuggestions = [
    "Generate a professional headshot, corporate style, with a clean, slightly blurred neutral background.",
    "Create a friendly and approachable headshot, smiling, with a warm, soft-focus background.",
    "Produce a dramatic, high-contrast black and white headshot with sharp lighting.",
    "Generate a creative headshot with an outdoor, natural background like a park or modern building.",
];

const editSuggestions = [
    "Change the background to a solid light gray color.",
    "Make the lighting warmer and softer.",
    "Convert the image to black and white.",
    "Enhance the details and sharpness of the image.",
    "Add a subtle vignette effect.",
];

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ mode, onSuggestionClick }) => {
  const suggestions = mode === 'generate' ? generateSuggestions : editSuggestions;

  return (
    <div className="mb-3">
        <p className="text-xs text-gray-400 mb-2">Suggestions:</p>
        <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
            <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="bg-gray-700/50 hover:bg-gray-700 text-xs text-gray-300 py-1 px-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
            {suggestion}
            </button>
        ))}
        </div>
    </div>
  );
};

export default PromptSuggestions;
