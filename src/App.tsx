import { useState } from 'react';
import { useAudio } from './hooks/useAudio';
import { TUNINGS, type Tuning } from './constants/tunings';
import { getClosestString, getCents, type ClosestStringResult } from './utils/tunerMath';
import { Mic, MicOff } from 'lucide-react';

function App() {
  const { start, stop, isListening, pitch } = useAudio();
  const [currentTuning, setCurrentTuning] = useState<Tuning>(TUNINGS[0]);
  const [manualStringIndex, setManualStringIndex] = useState<number | null>(null);
  let targetData: ClosestStringResult | null = null;

  if (manualStringIndex !== null) {
    const targetFreq = currentTuning.strings[manualStringIndex];
    targetData = {
      index: manualStringIndex,
      name: currentTuning.stringNames[manualStringIndex],
      targetFreq: targetFreq,
      diff: Math.abs(targetFreq - pitch)
    };
  } else {
    targetData = getClosestString(pitch, currentTuning);
  }
  const cents = (targetData && pitch > 0) ? getCents(pitch, targetData.targetFreq) : 0;
  
  const isPerfect = Math.abs(cents) < 5;
  const isTooHigh = cents > 5;
  const isTooLow = cents < -5;

  let statusClass = "";
  let statusText = manualStringIndex !== null ? "MANUAL FOCUS" : "Ready";
  let needleColor = "white";
  
  if (isListening && pitch > 0 && targetData) {
    if (isPerfect) {
      statusClass = "status-perfect";
      statusText = "PERFECT";
      needleColor = "#4ade80";
    } else if (isTooHigh) {
      statusClass = "status-high";
      statusText = "TOO HIGH ▼";
      needleColor = "#f87171";
    } else if (isTooLow) {
      statusClass = "status-low";
      statusText = "TOO LOW ▲";
      needleColor = "#facc15";
    }
  } else if (isListening && pitch === 0) {
    statusText = manualStringIndex !== null ? "Pluck string..." : "Pluck a string...";
  }
  const toggleStringFocus = (index: number) => {
    if (manualStringIndex === index) {
      setManualStringIndex(null)
    } else {
      setManualStringIndex(index);
    }
  };

  return (
    <div className="tuner-container">
      <div className="header">
        
        <div className="select-wrapper">
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <select 
              onChange={(e) => {
                const selected = TUNINGS.find(t => t.id === e.target.value);
                if (selected) {
                  setCurrentTuning(selected);
                  setManualStringIndex(null);
                }
              }}
              value={currentTuning.id}
            >
              {TUNINGS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="meter-wrapper">
         <div className="meter-arch" />
         
         <div 
           className="needle"
           style={{ 
             transform: `translateX(-50%) rotate(${pitch === 0 ? 0 : Math.max(-90, Math.min(90, cents))}deg)`,
             backgroundColor: needleColor,
             opacity: (pitch === 0 && manualStringIndex === null) ? 0.3 : 1 
           }}
         />
         <div className="needle-base" />
      </div>
      <div className={`note-circle ${statusClass}`}>
        <span>
          {targetData ? targetData.name : "--"}
        </span>
      </div>

      <div className="status-text">
           <div className={`status-label ${statusClass}`}>
             {statusText}
           </div>
           {(targetData && pitch > 0) && (
              <div className="hz-info">
                 {pitch.toFixed(1)} Hz / {targetData.targetFreq} Hz
              </div>
           )}
           {manualStringIndex !== null && (
             <div 
               onClick={() => setManualStringIndex(null)}
               className="reset-manual-btn"
             >
               Back to Auto
             </div>
           )}
      </div>

      <div className="strings-row">
        {currentTuning.stringNames.map((note, i) => {
          const isManualSelected = manualStringIndex === i;
          const isAutoDetected = manualStringIndex === null && targetData?.index === i && pitch > 0;
          
          return (
            <button 
              key={i}
              onClick={() => toggleStringFocus(i)} 
              className={`string-bubble ${isManualSelected ? "manual-selected" : ""} ${isAutoDetected ? "auto-active" : ""}`}
            >
              {note}
            </button>
          )
        })}
      </div>
      <button 
        onClick={isListening ? stop : start}
        className={`control-button ${isListening ? 'btn-stop' : 'btn-start'}`}
      >
        {isListening ? <><MicOff size={24}/> Stop</> : <><Mic size={24}/> Start</>}
      </button>

    </div>
  );
}

export default App;