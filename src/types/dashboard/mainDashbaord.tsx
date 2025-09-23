// Types
export type ViewType =
  | "dashboard"
  | "products"
  | "categories"
  | "users"
  | "vlog"
  | "wishlists"
  | "carts";

// Context
export interface AppContextType {
  currentView?: ViewType;
  setCurrentView?: (view: ViewType) => void;
  isSidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  setState?: React.Dispatch<React.SetStateAction<{
    currentView: ViewType;
    isSidebarOpen: boolean;
  }>>;
}
