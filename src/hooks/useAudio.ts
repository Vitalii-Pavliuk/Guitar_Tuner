import { useRef, useState } from "react";
import { PitchDetector } from "pitchy";

export const useAudio = () => {
  const [pitch, setPitch] = useState<number>(0);
  const [clarity, setClarity] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = async () => {
    try {
      const audioContext = new window.AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      const input = new Float32Array(detector.inputLength);

      const updatePitch = () => {
        if (!streamRef.current) return;
        
        analyser.getFloatTimeDomainData(input);

        const [frequency, clarityVal] = detector.findPitch(input, audioContext.sampleRate);

        if (clarityVal > 0.8 && frequency > 50 && frequency < 1000) {
          setPitch(frequency);
          setClarity(clarityVal);
        }

        window.requestAnimationFrame(updatePitch);
      };

      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error("Microphone error:", err);
    }
  };

  const stop = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
    setPitch(0);
    setClarity(0);
  };

  return { start, stop, isListening, pitch, clarity };
};