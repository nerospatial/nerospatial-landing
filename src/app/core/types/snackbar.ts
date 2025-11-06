export interface SnackbarItem {
  id: string;
  message: string;
  duration: number;
}

export interface SnackbarContextType {
  showError: (message: string, duration?: number) => void;
}