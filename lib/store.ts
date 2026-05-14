import { create } from "zustand";

type AppState = {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  setCommandOpen: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  commandOpen: false,
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setCommandOpen: (commandOpen) => set({ commandOpen })
}));
