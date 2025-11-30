import { useAlertStore } from "@/app/lib/utils/alert-store";

export function useAlert() {
    const show = useAlertStore((s) => s.show);

    return {
        success: (msg: string) => show("success", "Success", msg),
        error: (msg: string) => show("error", "Error", msg),
        warning: (msg: string) => show("warning", "Warning", msg),
        info: (msg: string) => show("info", "Info", msg),
    };
}
