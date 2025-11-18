export default function JSONFormatter() {
    return (
        <div className="grid flex-1 grid-cols-1 gap-px overflow-hidden bg-white/10 md:grid-cols-2">
            {/* <!-- Left Pane --> */}
            <div className="flex flex-col bg-background-dark">
                {/* <!-- Tabs --> */}
                <div className="border-b border-white/10">
                    <div className="flex px-4 gap-6">
                        <a className="flex flex-col items-center justify-center border-b-[2px] border-primary pb-2.5 pt-3 text-white" href="#">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Input</p>
                        </a>
                        <a className="flex flex-col items-center justify-center border-b-[2px] border-transparent pb-2.5 pt-3 text-white/60 hover:text-white" href="#">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Errors</p>
                        </a>
                    </div>
                </div>
                {/* <!-- TextField --> */}
                <div className="relative flex flex-1 flex-col overflow-hidden">
                    <textarea className="font-mono w-full flex-1 resize-none rounded-none border-none bg-transparent p-4 text-sm text-white/90 placeholder:text-white/40 focus:outline-0 focus:ring-0" placeholder='{ "paste": "your json here" }'>
                    </textarea>
                </div>
            </div>
            {/* <!-- Right Pane --> */}
            <div className="flex flex-col bg-background-dark">
                {/* <!-- Tabs --> */}
                <div className="border-b border-white/10">
                    <div className="flex px-4 gap-6">
                        <a className="flex flex-col items-center justify-center border-b-[2px] border-primary pb-2.5 pt-3 text-white" href="#">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Output</p>
                        </a>
                        <a className="flex flex-col items-center justify-center border-b-[2px] border-transparent pb-2.5 pt-3 text-white/60 hover:text-white" href="#">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">AI Suggestions</p>
                        </a>
                    </div>
                </div>
                {/* <!-- TextField --> */}
                <div className="relative flex flex-1 flex-col overflow-hidden">
                    <textarea className="font-mono w-full flex-1 resize-none rounded-none border-none bg-transparent p-4 text-sm text-white/90 focus:outline-0 focus:ring-0"
                        readOnly={true}>
                    </textarea>
                </div>
            </div>
        </div>
    )
}