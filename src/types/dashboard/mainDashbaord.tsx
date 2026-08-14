// Types
export type ViewType =
  | "dashboard"
  | "products"
  | "categories"
  | "users"
  | "orders"
  | "deliveries"
  | "pickups"
  | "vlog"
  | "report"
  | "wishlists"
  | "carts"
  | "slide"
  | "announcements"
  | "sms_broadcast";

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
