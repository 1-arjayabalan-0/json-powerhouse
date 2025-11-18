export default function SideNav() {
    return (
        <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-white/10 p-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <a className="flex items-center gap-3 rounded-md bg-primary/20 px-3 py-2 text-white transition-colors hover:bg-primary/30" href="#">
                        <span className="material-symbols-outlined text-xl">data_object</span>
                        <p className="text-sm font-medium leading-normal">JSON Formatter</p>
                    </a>
                    <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                        <span className="material-symbols-outlined text-xl">verified</span>
                        <p className="text-sm font-medium leading-normal">JSON Validator</p>
                    </a>
                    <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                        <span className="material-symbols-outlined text-xl">swap_horiz</span>
                        <p className="text-sm font-medium leading-normal">JSON &lt;&gt; CSV</p>
                    </a>
                    <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                        <span className="material-symbols-outlined text-xl">swap_horiz</span>
                        <p className="text-sm font-medium leading-normal">JSON &lt;&gt; YAML</p>
                    </a>
                    <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                        <span className="material-symbols-outlined text-xl">swap_horiz</span>
                        <p className="text-sm font-medium leading-normal">JSON &lt;&gt; XML</p>
                    </a>
                    <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                        <span className="material-symbols-outlined text-xl">difference</span>
                        <p className="text-sm font-medium leading-normal">JSON Diff</p>
                    </a>
                    <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                        <span className="material-symbols-outlined text-xl">auto_fix_high</span>
                        <p className="text-sm font-medium leading-normal">JSON Beautifier/Minifier</p>
                    </a>
                    <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                        <span className="material-symbols-outlined text-xl">schema</span>
                        <p className="text-sm font-medium leading-normal">JSON Schema Generator</p>
                    </a>
                    <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                        <span className="material-symbols-outlined text-xl">database</span>
                        <p className="text-sm font-medium leading-normal">SQL Generator</p>
                    </a>
                    <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                        <span className="material-symbols-outlined text-xl">code</span>
                        <p className="text-sm font-medium leading-normal">TypeScript Types Generator</p>
                    </a>
                </div>
            </div>
            <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
                <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                    <span className="material-symbols-outlined text-xl">history</span>
                    <p className="text-sm font-medium leading-normal">History</p>
                </a>
                <a className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" href="#">
                    <span className="material-symbols-outlined text-xl">snippet_folder</span>
                    <p className="text-sm font-medium leading-normal">Snippets</p>
                </a>
            </div>
        </aside>
    )
}