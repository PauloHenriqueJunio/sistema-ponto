export interface User {
  id: number;
  name: string;
}

export interface Ponto {
  id: number;
  type: string;
  timestamp: string;
  user: { name: string };
}
