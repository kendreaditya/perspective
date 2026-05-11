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
            Four people, one scene, four irreconcilable accounts of what's there. Each holds their gaze on something different — and each is convinced that <em>that</em> is the thing worth looking at. Perspective doesn't just colour reality; it selects it.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2 text-blue-400">Four Gazes</h3>
          <ul className="text-slate-300 space-y-2 list-disc pl-5">
            <li><span className="text-green-400 font-medium">Green</span> — fixes on the object. The empiricist: <em>the thing is the thing, look at it.</em></li>
            <li><span className="text-blue-400 font-medium">Blue</span> — looks at the base. The foundationalist: <em>the form is incidental; what matters is what it rests on.</em></li>
            <li><span className="text-amber-400 font-medium">Orange</span> — watches the green gazer. The sociologist of knowledge: <em>I don't study things, I study how people see them.</em></li>
            <li><span className="text-rose-400 font-medium">Rose</span> — looks at <em>you</em>. The recursive twist: your "neutral" view of this scene is itself a perspective.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2 text-blue-400">Why It Matters</h3>
          <p className="text-slate-300">
            We talk about objectivity as if it were a place you could stand. But every claim to see things "as they really are" rests on prior commitments — what counts as evidence (epistemology), what counts as real (ontology), what counts as worth attending to. Even the camera angle is an angle.
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