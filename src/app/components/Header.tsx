"use client"

import { useTheme } from "next-themes"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./ui/navigation-menu"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
import { useIsMobile } from "../hooks/utils/use-mobile"
import router from "next/router"

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <CircleHelpIcon />
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}

export default function Header() {
    const { theme, setTheme } = useTheme()
    const isMobile = useIsMobile()

    const components: { title: string; href: string; description: string }[] = [
        {
            title: "Alert Dialog",
            href: "/docs/primitives/alert-dialog",
            description:
                "A modal dialog that interrupts the user with important content and expects a response.",
        },
        {
            title: "Hover Card",
            href: "/docs/primitives/hover-card",
            description:
                "For sighted users to preview content available behind a link.",
        },
        {
            title: "Progress",
            href: "/docs/primitives/progress",
            description:
                "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
        },
        {
            title: "Scroll-area",
            href: "/docs/primitives/scroll-area",
            description: "Visually or semantically separates content.",
        },
        {
            title: "Tabs",
            href: "/docs/primitives/tabs",
            description:
                "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
        },
        {
            title: "Tooltip",
            href: "/docs/primitives/tooltip",
            description:
                "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
        },
    ]

    return (
        <header className="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-white/10 p-5 h-15">
            <Link href={"/"} className="flex items-center gap-4 text-white" >
                <div className="size-5">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_6_535)">
                            <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                                fill="currentColor" fillRule="evenodd"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_6_535">
                                <rect fill="white" height="48" width="48"></rect>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">JSON PowerHouse</h2>
            </Link>
            <div className="flex flex-1 justify-end gap-6">
                <NavigationMenu>
                    <NavigationMenuList className="flex-wrap">
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>JSON Formatters</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {components?.map((component) => (
                                        <ListItem
                                            className="p-2"
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="hidden md:block">
                            <NavigationMenuTrigger>JSON Converters</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[300px] gap-4">
                                    <li>
                                        <NavigationMenuLink className="p-2" asChild>
                                            <Link href="#">
                                                <div className="font-medium">Components</div>
                                                <div className="text-muted-foreground">
                                                    Browse all components in the library.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink className="p-2" asChild>
                                            <Link href="#">
                                                <div className="font-medium">Documentation</div>
                                                <div className="text-muted-foreground">
                                                    Learn how to use the library.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink className="p-2" asChild>
                                            <Link href="#">
                                                <div className="font-medium">Blog</div>
                                                <div className="text-muted-foreground">
                                                    Read our latest blog posts.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>
                {/* <div className="flex items-center gap-6">
                    <a className="text-white/80 hover:text-white text-sm font-medium leading-normal" href="#">API</a>
                    <a className="text-white/80 hover:text-white text-sm font-medium leading-normal" href="#">Docs</a>
                    <a className="text-white/80 hover:text-white text-sm font-medium leading-normal" href="#">Pricing</a>
                </div>
                <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white hover:bg-white/20"
                    onClick={() => {
                        theme == 'dark' || theme == 'system' ? setTheme('light') : setTheme('dark')
                    }}>
                    <span className="material-symbols-outlined text-xl">dark_mode</span>
                </button> */}
            </div>
        </header>
    )
}