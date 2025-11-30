import { create } from "zustand";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertMessage {
  id: string;
  type: AlertType;
  title: string;
  message: string;
}

interface AlertStore {
  alerts: AlertMessage[];
  show: (type: AlertType, title: string, message: string) => void;
  remove: (id: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  show: (type, title, message) =>
    set((state) => ({
      alerts: [
        ...state.alerts,
        { id: crypto.randomUUID(), type, title, message },
      ],
    })),
  remove: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
}));
