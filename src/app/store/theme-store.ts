import create from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  loadPreferences: () => void;
  setPreference: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      loadPreferences: () => {
        const theme = get().theme;
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
          set((state) => ({ theme: "dark" }));
        } else {
          document.documentElement.classList.remove("dark");
          set((state) => ({ theme: "light" }));
        }
      },
      setPreference: (theme) => {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
          set((state) => ({ theme: "dark" }));
        } else {
          document.documentElement.classList.remove("dark");
          set((state) => ({ theme: "light" }));
        }
      },
    }),
    { name: "theme" }
  )
);
