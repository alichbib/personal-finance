import { createContext } from 'react';

export interface ToastState {
  id: number;
  message: string;
}

export interface ToastContextValue {
  showToast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
