export interface Tuning {
  id: string;
  name: string;
  strings: number[];
  stringNames: string[];
}

const NOTES: Record<string, number> = {
  C2: 65.41, Cs2: 69.30, D2: 73.42, Ds2: 77.78, E2: 82.41, F2: 87.31,
  Fs2: 92.50, G2: 98.00, Gs2: 103.83, A2: 110.00, As2: 116.54, B2: 123.47,
  C3: 130.81, Cs3: 138.59, D3: 146.83, Ds3: 155.56, E3: 164.81, F3: 174.61,
  Fs3: 185.00, G3: 196.00, Gs3: 207.65, A3: 220.00, As3: 233.08, B3: 246.94,
  C4: 261.63,  Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63
};

export const TUNINGS: Tuning[] = [
  {
    id: 'standard',
    name: 'Standard E',
    strings: [NOTES.E2, NOTES.A2, NOTES.D3, NOTES.G3, NOTES.B3, NOTES.E4],
    stringNames: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    id: 'drop_d',
    name: 'Drop D',
    strings: [NOTES.D2, NOTES.A2, NOTES.D3, NOTES.G3, NOTES.B3, NOTES.E4],
    stringNames: ['D', 'A', 'D', 'G', 'B', 'E']
  },
  {
    id: 'drop_c',
    name: 'Drop C',
    strings: [NOTES.C2, NOTES.G2, NOTES.C3, NOTES.F3, NOTES.A3, NOTES.D4],
    stringNames: ['C', 'G', 'C', 'F', 'A', 'D']
  }, 
  {
    id: 'standard_c_sharp',
    name: 'C# Standard',
    strings: [NOTES.Cs2, NOTES.Fs2, NOTES.B2, NOTES.E3, NOTES.Gs3, NOTES.Cs4],
    stringNames: ['C#', 'F#', 'B', 'E', 'G#', 'C#']
  },
  {
  id: 'drop_c_sharp',
  name: 'Drop C#',
  strings: [NOTES.Cs2, NOTES.Gs2, NOTES.Cs3, NOTES.Fs3, NOTES.As3, NOTES.Ds4],
  stringNames: ['C#', 'G#', 'C#', 'F#', 'A#', 'D#']
},
  
];