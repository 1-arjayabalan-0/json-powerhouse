"use client";

import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { useAlertStore } from "@/app/lib/utils/alert-store";
import { useEffect } from "react";

export default function AlertService() {
    const alerts = useAlertStore((s) => s.alerts);
    const remove = useAlertStore((s) => s.remove);

    // auto remove after 4 seconds
    useEffect(() => {
        alerts.forEach((alert) => {
            setTimeout(() => remove(alert.id), 4000);
        });
    }, [alerts]);

    const getColor = (type: string) => {
        return {
            success: "border-green-500/40 bg-green-900/20 text-green-200",
            error: "border-red-500/40 bg-red-900/20 text-red-200",
            warning: "border-yellow-500/40 bg-yellow-900/20 text-yellow-100",
            info: "border-blue-500/40 bg-blue-900/20 text-blue-200",
        }[type];
    };

    return (
        <div className="fixed top-4 right-4 flex flex-col gap-3 w-80 z-50">
            {alerts.map((alert) => (
                <Alert
                    key={alert.id}
                    className={`border p-4 rounded-lg shadow-md dark:bg-black/50 ${getColor(alert.type)}`}
                >
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
            ))}
        </div>
    );
}
