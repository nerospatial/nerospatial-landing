"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ErrorSnackbar from "../components/ErrorSnackbar";
import { SnackbarContextType, SnackbarItem } from "../types/snackbar";

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

  const showError = (message: string, duration = 5000) => {
    const id = Date.now().toString();
    setSnackbars((prev) => [...prev, { id, message, duration }]);
  };

  const removeSnackbar = (id: string) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  };

  return (
    <SnackbarContext.Provider value={{ showError }}>
      {children}
      {snackbars.map((snackbar) => (
        <ErrorSnackbar
          key={snackbar.id}
          message={snackbar.message}
          duration={snackbar.duration}
          onClose={() => removeSnackbar(snackbar.id)}
        />
      ))}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}
