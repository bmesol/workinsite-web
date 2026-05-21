interface Shift {
  id: number;
  name: string;
  multiplier: string;
}

interface ShiftRequest {
  name: string;
  multiplier: string;
}

export type { Shift, ShiftRequest };