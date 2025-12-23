import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface AppState {
  appName: string;
  version: string;
  showBeian: boolean;
  beianNumber: string;
  icpLicense: string;
  policeBeianNumber: string;
}

interface AppActions {
  setAppName: (name: string) => void;
  setVersion: (version: string) => void;
  setShowBeian: (show: boolean) => void;
  setBeianNumber: (number: string) => void;
  setIcpLicense: (license: string) => void;
  setPoliceBeianNumber: (number: string) => void;
}

export const useAppStore = create<AppState & AppActions>()(
  immer((set) => ({
    appName: "AI 知识库",
    version: "1.0.0",
    showBeian: true,
    beianNumber: "111111111111111",
    icpLicense: "2222",
    policeBeianNumber: "333",
    setAppName: (name) =>
      set((state) => {
        state.appName = name;
      }),
    setVersion: (version) =>
      set((state) => {
        state.version = version;
      }),
    setShowBeian: (show) =>
      set((state) => {
        state.showBeian = show;
      }),
    setBeianNumber: (number) =>
      set((state) => {
        state.beianNumber = number;
      }),
    setIcpLicense: (license) =>
      set((state) => {
        state.icpLicense = license;
      }),
    setPoliceBeianNumber: (number) =>
      set((state) => {
        state.policeBeianNumber = number;
      }),
  }))
);
