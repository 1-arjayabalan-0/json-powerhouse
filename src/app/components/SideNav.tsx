"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolsConfig, ToolCategory } from '@/app/config/tools-config';

export default function SideNav() {
    const pathname = usePathname();
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['json-tools']);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCategory = (categoryId: string) => {
        if (isCollapsed) return; // Don't allow category expansion when collapsed
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const isToolActive = (toolPath: string) => {
        return pathname === toolPath;
    };

    return (
        <aside className={`flex shrink-0 flex-col border-r border-white/10 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            {/* Toggle Button */}
            <div className="flex items-center justify-center border-b bg-blue-900/20">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex p-1 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <span className={`material-symbols-outlined text-xl transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
                        chevron_left
                    </span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-2">
                    {toolsConfig.map((category: ToolCategory) => {
                        const isExpanded = expandedCategories.includes(category.id) && !isCollapsed;

                        return (
                            <div key={category.id} className="flex flex-col">
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="flex items-center justify-between rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white w-full"
                                    title={isCollapsed ? category.name : undefined}
                                >
                                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                                        <span className="material-symbols-outlined text-xl">{category.icon}</span>
                                        {!isCollapsed && <p className="text-sm font-semibold leading-normal">{category.name}</p>}
                                    </div>
                                    {!isCollapsed && (
                                        <span className={`material-symbols-outlined text-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    )}
                                </button>

                                {/* Subcategories/Tools */}
                                {isExpanded && !isCollapsed && (
                                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-white/10 pl-2">
                                        {category.tools.map((tool) => {
                                            const isActive = isToolActive(tool.path);

                                            return (
                                                <Link
                                                    key={tool.id}
                                                    href={tool.path}
                                                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${isActive
                                                        ? 'bg-blue-600/20 text-white font-medium'
                                                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                >
                                                    {tool.icon && (
                                                        <span className="material-symbols-outlined text-base">{tool.icon}</span>
                                                    )}
                                                    <p className="text-xs leading-normal">{tool.name}</p>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Section (Optional) */}
            {!isCollapsed && (
                <div className="border-t border-white/10 p-4">
                    <div className="flex flex-col gap-2">
                        <Link
                            href="/about"
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white text-xs"
                        >
                            <span className="material-symbols-outlined text-lg">info</span>
                            <p className="font-medium leading-normal">About</p>
                        </Link>
                        <Link
                            href="/feedback"
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white text-xs"
                        >
                            <span className="material-symbols-outlined text-lg">feedback</span>
                            <p className="font-medium leading-normal">Feedback</p>
                        </Link>
                    </div>
                </div>
            )}
        </aside>
    );
}