import { type Tuning } from "../constants/tunings";

interface ClosestStringResult {
  index: number;
  name: string;
  targetFreq: number;
  diff: number;
}

export function getClosestString(pitch: number, tuning: Tuning): ClosestStringResult | null {
  if (!pitch || pitch < 50) return null;

  let minDiff = Infinity;
  let closestIndex = -1;

  tuning.strings.forEach((targetFreq, index) => {
    const diff = Math.abs(targetFreq - pitch);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = index;
    }
  });

  if (closestIndex === -1) return null;

  return {
    index: closestIndex,
    name: tuning.stringNames[closestIndex],
    targetFreq: tuning.strings[closestIndex],
    diff: minDiff
  };
}

export function getCents(frequency: number, targetFrequency: number): number {
  return 1200 * Math.log2(frequency / targetFrequency);
}