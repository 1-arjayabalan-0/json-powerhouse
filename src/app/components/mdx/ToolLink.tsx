import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolById } from "@/app/config/tool-registry";

export default function ToolLink({ id }: { id: string }) {
    const tool = getToolById(id);
    if (!tool) return null;
    const Icon = tool.icon;
    return (
        <Link href={tool.path} className="not-prose no-underline text-foreground my-6 flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors">
            <Icon className="size-5 text-primary" />
            <span className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Try the {tool.name}</span>
                <span className="text-xs text-muted-foreground">{tool.tagline}</span>
            </span>
            <ArrowRight className="ml-auto size-4 text-muted-foreground" />
        </Link>
    );
}
