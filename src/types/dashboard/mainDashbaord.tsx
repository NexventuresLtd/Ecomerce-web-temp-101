// Types
export type ViewType = 'dashboard' | 'products' | 'categories' | 'users' | 'orders' | 'wishlists' | 'carts';
// Context
export interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}