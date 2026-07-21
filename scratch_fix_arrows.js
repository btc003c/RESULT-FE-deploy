const fs = require('fs');
let c = fs.readFileSync('src/app/(social)/results/page.tsx', 'utf8');

// 1. Inject the new ref
c = c.replace(
  '  const liveScrollRef = useRef<HTMLDivElement>(null);',
  '  const liveScrollRef = useRef<HTMLDivElement>(null);\n  const ringsScrollRef = useRef<HTMLDivElement>(null);'
);

// 2. Inject the new scroll function
c = c.replace(
  '  const scrollLive = (dir: \'left\' | \'right\') => {',
  `  const scrollRings = (dir: 'left' | 'right') => {
    if (ringsScrollRef.current) {
      ringsScrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const scrollLive = (dir: 'left' | 'right') => {`
);

// 3. Fix the Quick Results Bar wrapper
const targetStr = `          {/* Quick Results Bar */}
          <div className="relative group/scroll max-w-5xl mt-6 pt-6 border-t border-zinc-100">
            <button onClick={() => scrollLive('left')} className="absolute left-0 top-[35%] -translate-y-1/2 z-30 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all opacity-0 group-hover/scroll:opacity-100 -ml-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={() => scrollLive('right')} className="absolute right-0 top-[35%] -translate-y-1/2 z-30 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all opacity-0 group-hover/scroll:opacity-100 -mr-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <div ref={liveScrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar pb-2 items-center px-2 snap-x">`;

const replacementStr = `          {/* Quick Results Bar */}
          <div className="max-w-5xl mt-6 pt-6 border-t border-zinc-100">
            <div className="relative group/scroll w-full">
              <button onClick={() => scrollRings('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all opacity-0 group-hover/scroll:opacity-100 -ml-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button onClick={() => scrollRings('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all opacity-0 group-hover/scroll:opacity-100 -mr-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <div ref={ringsScrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar items-center px-2 snap-x pb-2">`;

c = c.replace(targetStr, replacementStr);

// Close the extra div at the end
const endTargetStr = `                  <span className="text-[11px] font-bold text-zinc-700 truncate max-w-[64px] text-center">{story.title}</span>
                </div>
              ))}
            </div>
          </div>

        </div>`;
const endReplacementStr = `                  <span className="text-[11px] font-bold text-zinc-700 truncate max-w-[64px] text-center">{story.title}</span>
                </div>
              ))}
              </div>
            </div>
          </div>

        </div>`;

c = c.replace(endTargetStr, endReplacementStr);

fs.writeFileSync('src/app/(social)/results/page.tsx', c);
