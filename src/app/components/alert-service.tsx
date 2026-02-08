"use client";

import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { useAlertStore } from "@/core/lib/utils/alert-store";
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
            success: "border-success/40 bg-success/20 text-success",
            error: "border-destructive/40 bg-destructive/20 text-destructive",
            warning: "border-warning/40 bg-warning/20 text-warning",
            info: "border-primary/40 bg-primary/20 text-primary",
        }[type];
    };

    return (
        <div className="fixed top-4 right-4 flex flex-col gap-3 w-80 z-50">
            {alerts.map((alert) => (
                <Alert
                    key={alert.id}
                    className={`border p-4 rounded-lg shadow-md bg-background ${getColor(alert.type)}`}
                >
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
            ))}
        </div>
    );
}
