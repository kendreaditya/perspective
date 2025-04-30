import React, { useState } from 'react';
import { Eye } from 'lucide-react';

interface IntroOverlayProps {
  onStart: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onStart }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  const handleStart = () => {
    setFadeOut(true);
    setTimeout(onStart, 1000); // Delay to allow for fade out animation
  };
  
  return (
    <div 
      className={`absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md z-20 p-4 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <Eye size={64} className="text-blue-400" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Perspectives
        </h1>
        
        <p className="text-slate-300 mb-8 text-lg">
          This visualization demonstrates how different individuals perceive the same reality from their unique viewpoints. 
          Each person has their own perspective, represented by the colored vision cones projecting from their eyes.
        </p>
        
        <div className="mb-8 p-4 bg-white/5 rounded-lg">
          <p className="text-slate-200">
            <span className="font-semibold">Interaction:</span> Click and drag to rotate the scene. Use the scroll wheel to zoom in and out.
          </p>
        </div>
        
        <button 
          onClick={handleStart}
          className="px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 transform hover:scale-105"
        >
          Explore Perspectives
        </button>
      </div>
    </div>
  );
};

export default IntroOverlay;