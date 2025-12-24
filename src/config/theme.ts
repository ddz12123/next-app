export type MarkdownTheme = "github-light" | "github-dark" | "one-light" | "one-dark" | "dracula" | "nord";

export const DEFAULT_THEME: MarkdownTheme = "github-light";

export const THEMES: MarkdownTheme[] = ["github-light", "github-dark", "one-light", "one-dark", "dracula", "nord"];

export const THEME_LABELS: Record<MarkdownTheme, string> = {
  "github-light": "GitHub 浅色",
  "github-dark": "GitHub 深色",
  "one-light": "One 浅色",
  "one-dark": "One 深色",
  "dracula": "Dracula",
  "nord": "Nord",
};
