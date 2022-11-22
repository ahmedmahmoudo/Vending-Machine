export interface UserInterface {
  id: number;
  username: string;
  deposit: number;
  accessToken: string;
  role: string;
}

export interface AuthStateInterface {
  user?: UserInterface;
  isLoading?: boolean;
  errors?: string;
}
