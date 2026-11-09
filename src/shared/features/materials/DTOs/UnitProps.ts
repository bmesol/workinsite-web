interface UnitRequest {
    name: string;
  }
  
  interface Unit {
    id: number;
    name: string;
    isActive: boolean;
    note: string | null;
  }
  
  export type { UnitRequest, Unit };
  