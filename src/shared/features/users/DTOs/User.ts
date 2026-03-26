interface User {
  id: number;
  name: string;
  phone: string;
  language: string;
  role: {
    id: number;
    name: string;
  };
  note: string | null;
  isActive: boolean;
}

export type { User };