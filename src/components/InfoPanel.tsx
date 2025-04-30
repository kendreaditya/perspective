import React, { useState } from 'react';
import { X } from 'lucide-react';

interface InfoPanelProps {
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ onClose }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  const handleClose = () => {
    setFadeOut(true);
    setTimeout(onClose, 300); // Delay to allow for fade out animation
  };
  
  return (
    <div 
      className={`absolute inset-y-0 right-0 w-full md:w-80 bg-slate-800/90 backdrop-blur-md text-white p-6 z-10 shadow-xl overflow-y-auto transition-all duration-300 ${fadeOut ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">About This Visualization</h2>
        <button onClick={handleClose} className="text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2 text-blue-400">The Concept</h3>
          <p className="text-slate-300">
            This 3D scene illustrates the philosophical concept that people can look at the same object but see it differently based on their position and perspective.
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mb-2 text-blue-400">What You're Seeing</h3>
          <ul className="text-slate-300 space-y-2 list-disc pl-5">
            <li>Each figure represents a person with a unique viewpoint</li>
            <li>The colored cones represent their field of vision</li>
            <li>The vase in the center is the shared object of attention</li>
            <li>Notice how each person has a different angle on the same object</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mb-2 text-blue-400">Beyond The Visual</h3>
          <p className="text-slate-300">
            This visualization serves as a metaphor for how our backgrounds, experiences, and positions in life affect how we perceive and interpret reality. Even when looking at the same "truth," our perspective shapes what we see.
          </p>
        </section>
        
        <section className="pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400 italic">
            "We don't see things as they are, we see them as we are." — Anaïs Nin
          </p>
        </section>
      </div>
    </div>
  );
};

export default InfoPanel;