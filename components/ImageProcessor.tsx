import React, { useState, useCallback, useEffect } from 'react';
import { Mode } from '../types';
import { generateOrEditImage } from '../services/geminiService';
import { UploadIcon, SparklesIcon, DownloadIcon } from './icons';
import PromptSuggestions from './PromptSuggestions';

const DEFAULT_GENERATE_PROMPT = "Generate a professional headshot portrait, high quality, corporate style with a clean, slightly blurred neutral background.";

const ImageProcessor: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_GENERATE_PROMPT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'generate') {
      setPrompt(DEFAULT_GENERATE_PROMPT);
    } else {
      setPrompt('');
    }
  }, [mode]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSourceImage(e.target?.result as string);
        setProcessedImage(null); // Reset processed image on new upload
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    const imageToProcess = (mode === 'edit' && processedImage) ? processedImage : sourceImage;

    if (!imageToProcess) {
      setError("Please upload an image first.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateOrEditImage(prompt, imageToProcess);
      setProcessedImage(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, sourceImage, processedImage, mode]);
  
  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const ImagePanel: React.FC<{ imageUrl: string | null; onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; title: string; isUploader?: boolean }> = ({ imageUrl, onFileChange, title, isUploader = false }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center aspect-square">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-400">{title}</h2>
      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-600 rounded-md overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        ) : (
          isUploader && onFileChange ? (
            <label htmlFor="image-upload" className="flex flex-col items-center justify-center text-center cursor-pointer text-gray-500 hover:text-cyan-400 transition-colors">
              <UploadIcon className="w-12 h-12 mb-2" />
              <span>Click to upload image</span>
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          ) : (
             <div className="flex flex-col items-center justify-center text-center text-gray-600">
                <SparklesIcon className="w-12 h-12 mb-2"/>
                <span>Your result will appear here</span>
             </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Mode Toggle */}
      <div className="flex justify-center bg-gray-800 p-1 rounded-full max-w-sm mx-auto">
        <button onClick={() => setMode('generate')} className={`w-1/2 py-2 px-4 rounded-full transition-all duration-300 ${mode === 'generate' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-700'}`}>
          Generate Headshot
        </button>
        <button onClick={() => setMode('edit')} className={`w-1/2 py-2 px-4 rounded-full transition-all duration-300 ${mode === 'edit' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-700'}`}>
          Edit Image
        </button>
      </div>

      {/* Image Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImagePanel title="Source Image" imageUrl={sourceImage} onFileChange={handleFileChange} isUploader={true} />
        <div className="relative">
            <ImagePanel title="Result" imageUrl={processedImage} />
            {processedImage && (
                <a 
                  href={processedImage} 
                  download="processed-image.png"
                  className="absolute top-6 right-6 bg-gray-700 hover:bg-cyan-500 text-white p-2 rounded-full transition-colors duration-200"
                  aria-label="Download Image"
                  title="Download Image"
                >
                  <DownloadIcon className="w-5 h-5"/>
                </a>
            )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-inner flex flex-col gap-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
          <PromptSuggestions mode={mode} onSuggestionClick={handleSuggestionClick} />
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={mode === 'generate' ? 'Describe the desired headshot...' : 'Describe the change, e.g., "add a retro filter"'}
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            disabled={isLoading}
          />
        </div>

        {error && <p className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md">{error}</p>}
        
        <button
          onClick={handleSubmit}
          disabled={isLoading || !sourceImage}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
                <SparklesIcon className="w-5 h-5"/>
                <span>{mode === 'generate' ? 'Generate Headshot' : 'Apply Edit'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageProcessor;