export default function Header() {
    return (
        <header className="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-white/10 px-6 py-3">
            <div className="flex items-center gap-4 text-white">
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
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">JSON Supertool</h2>
            </div>
            <div className="flex flex-1 justify-end gap-6">
                <div className="flex items-center gap-6">
                    <a className="text-white/80 hover:text-white text-sm font-medium leading-normal" href="#">API</a>
                    <a className="text-white/80 hover:text-white text-sm font-medium leading-normal" href="#">Docs</a>
                    <a className="text-white/80 hover:text-white text-sm font-medium leading-normal" href="#">Pricing</a>
                </div>
                <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white hover:bg-white/20">
                    <span className="material-symbols-outlined text-xl">dark_mode</span>
                </button>
            </div>
        </header>
    )
}