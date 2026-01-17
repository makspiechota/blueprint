"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect, useMemo } from "react";

export type AppMode = "blueprint" | "software-factory";

type ModeContextType = {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  apiBaseUrl: string;
  wsUrl: string;
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

// API configuration per mode
const MODE_CONFIG = {
  blueprint: {
    apiBaseUrl: "http://localhost:3001",
    wsUrl: "ws://localhost:8080",
  },
  "software-factory": {
    apiBaseUrl: "http://localhost:3005",
    wsUrl: "ws://localhost:8085",
  },
};

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setModeState] = useState<AppMode>("blueprint");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load mode preference from localStorage
    const savedMode = localStorage.getItem("appMode") as AppMode | null;
    if (savedMode && (savedMode === "blueprint" || savedMode === "software-factory")) {
      setModeState(savedMode);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("appMode", mode);
    }
  }, [mode, isInitialized]);

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState((prevMode) =>
      prevMode === "blueprint" ? "software-factory" : "blueprint"
    );
  };

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
      apiBaseUrl: MODE_CONFIG[mode].apiBaseUrl,
      wsUrl: MODE_CONFIG[mode].wsUrl,
    }),
    [mode]
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};
