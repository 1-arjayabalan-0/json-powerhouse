"use client"

import { useTheme } from "next-themes"
import Link from "next/link"
import { useIsMobile } from "../hooks/utils/use-mobile"
import { useMode } from "@/app/context/ModeContext"
import Image from 'next/image'

export default function Header() {
    const { theme, setTheme } = useTheme()
    const isMobile = useIsMobile()
    const { mode, setMode } = useMode()

    return (
        <header className="flex shrink-0 items-center justify-between whitespace-nowrap border-border px-5 py-2 h-20">
            <Link href={"/"} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors" >
               <Image src={"/JSON-PowerHouse-Logo.png"} alt="logo"
               width={150} height={50} />
            </Link>
            <div className="flex flex-1 justify-end gap-6">
                <div className="flex items-center bg-muted rounded-lg p-1 border border-border">
                    <button
                        onClick={() => setMode('json')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            mode === 'json'
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                    >
                        JSON Editor
                    </button>
                    <div className="relative">
                        <button
                            disabled
                            className="px-4 py-1.5 rounded-md text-sm font-medium text-muted-foreground cursor-not-allowed"
                        >
                            Code Editor
                        </button>
                        <span className="absolute -top-2 -right-3 bg-[color-mix(in_srgb,var(--secondary)_10%,transparent)] text-secondary text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[color-mix(in_srgb,var(--secondary)_50%,transparent)] shadow-sm">
                            SOON
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}