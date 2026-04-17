export interface Owner {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: "Manual" | "Automatic";
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  color: string;
  description: string;
  image?: string;
  owner?: Owner;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  registeredUsers: StoredUser[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePhone: (phone: string | undefined) => Promise<void>;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => { valid: boolean; message: string };
}

export interface CarState {
  cars: Car[];
  favorites: string[];
  toggleFavorite: (carId: string) => void;
}
