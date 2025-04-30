import React, { useState } from 'react';
import PerspectiveScene from './components/PerspectiveScene';
import IntroOverlay from './components/IntroOverlay';
import InfoPanel from './components/InfoPanel';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const handleStartClick = () => {
    setShowIntro(false);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* Main 3D Canvas */}
      <PerspectiveScene />

      {/* Intro Overlay */}
      {showIntro && <IntroOverlay onStart={handleStartClick} />}

      {/* Info Button */}
      <button 
        onClick={toggleInfo}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white transition-all duration-300"
      >
        {showInfo ? 'Close Info' : 'About This Scene'}
      </button>

      {/* Info Panel */}
      {showInfo && <InfoPanel onClose={toggleInfo} />}

      {/* Caption */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm md:text-base backdrop-blur-md bg-black/20 px-4 py-2 rounded-full">
        Different perspectives of the same reality
      </div>
    </div>
  );
}

export default App;