import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { AppContextType, ViewType } from "../../types/dashboard/mainDashbaord";

interface AppState {
  currentView: ViewType;
  isSidebarOpen: boolean;
}

const LOCAL_STORAGE_KEY = "appState";

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppState] = useState<AppState>(() => {
    if (typeof window === "undefined") {
      // Server-side fallback
      return { currentView: "dashboard", isSidebarOpen: true };
    }
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate parsed object
        if (
          typeof parsed.currentView === "string" &&
          typeof parsed.isSidebarOpen === "boolean"
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Failed to parse localStorage appState:", error);
    }
    return { currentView: "dashboard", isSidebarOpen: true };
  });

  // Update localStorage whenever appState changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
    } catch (error) {
      console.warn("Failed to save appState to localStorage:", error);
    }
  }, [appState]);

  // Helpers
  const setCurrentView = (view: ViewType) => {
    setAppState((prev) => ({ ...prev, currentView: view }));
  };

  const setSidebarOpen = (open: boolean) => {
    setAppState((prev) => ({ ...prev, isSidebarOpen: open }));
  };

  const contextValue: AppContextType = {
    currentView: appState.currentView,
    isSidebarOpen: appState.isSidebarOpen,
    setCurrentView,
    setSidebarOpen,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
