import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_THEME, THEMES, type MarkdownTheme } from "@/config/theme";

interface MarkdownState {
  theme: MarkdownTheme;
  rehypeConfig: {
    theme: MarkdownTheme;
    grid: boolean;
  };
}

interface MarkdownActions {
  setTheme: (theme: MarkdownTheme) => void;
  toggleTheme: () => void;
  setRehypeConfig: (config: Partial<MarkdownState["rehypeConfig"]>) => void;
}

export const useMarkdownStore = create<MarkdownState & MarkdownActions>()(
  persist(
    immer((set) => ({
      theme: DEFAULT_THEME,
      rehypeConfig: {
        theme: DEFAULT_THEME,
        grid: false,
      },
      setTheme: (theme) =>
        set((state) => {
          state.theme = theme;
          state.rehypeConfig.theme = theme;
        }),
      toggleTheme: () =>
        set((state) => {
          const currentIndex = THEMES.indexOf(state.theme);
          const nextIndex = (currentIndex + 1) % THEMES.length;
          state.theme = THEMES[nextIndex];
          state.rehypeConfig.theme = THEMES[nextIndex];
        }),
      setRehypeConfig: (config) =>
        set((state) => {
          state.rehypeConfig = { ...state.rehypeConfig, ...config };
        }),
    })),
    {
      name: "markdown-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
