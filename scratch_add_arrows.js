const fs = require('fs');
let c = fs.readFileSync('src/app/(social)/results/page.tsx', 'utf8');

const targetStr = `          {/* Quick Results Bar */}
          <div className="max-w-5xl mt-6 pt-6 border-t border-zinc-100 flex gap-6 overflow-x-auto hide-scrollbar pb-2 items-center">
              {[`;

const replacementStr = `          {/* Quick Results Bar */}
          <div className="relative group/scroll max-w-5xl mt-6 pt-6 border-t border-zinc-100">
            <button onClick={() => scrollLive('left')} className="absolute left-0 top-[60%] -translate-y-1/2 -ml-4 w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-md z-30 text-zinc-500 hover:text-zinc-900 opacity-0 group-hover/scroll:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={() => scrollLive('right')} className="absolute right-0 top-[60%] -translate-y-1/2 -mr-4 w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-md z-30 text-zinc-500 hover:text-zinc-900 opacity-0 group-hover/scroll:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <div ref={liveScrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar pb-2 items-center px-2 snap-x">
              {[`;

c = c.replace(targetStr, replacementStr);

const dataTargetStr = `{ id: 'm11', type: 'flash', title: 'Weather', text: '🌪️', color: 'bg-teal-100', textCol: 'text-teal-600' },
              ].map(story => (`;

const dataReplacementStr = `{ id: 'm11', type: 'flash', title: 'Weather', text: '🌪️', color: 'bg-teal-100', textCol: 'text-teal-600' },
                { id: 'm13', type: 'live', title: 'F1 Race', text: '🏎️', color: 'bg-red-100', textCol: 'text-red-600' },
                { id: 'm14', type: 'flash', title: 'Tech IPO', text: '💸', color: 'bg-green-100', textCol: 'text-green-600' },
                { id: 'm15', type: 'live', title: 'Tennis', text: '🎾', color: 'bg-lime-100', textCol: 'text-lime-600' },
                { id: 'm16', type: 'flash', title: 'Olympics', text: '🥇', color: 'bg-yellow-100', textCol: 'text-yellow-600' },
                { id: 'm17', type: 'flash', title: 'Golf', text: '⛳', color: 'bg-emerald-100', textCol: 'text-emerald-600' },
                { id: 'm18', type: 'live', title: 'Boxing', text: '🥊', color: 'bg-red-100', textCol: 'text-red-600' },
              ].map(story => (`;

c = c.replace(dataTargetStr, dataReplacementStr);

// add snap-start to the story div
c = c.replace(
  'className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95 group/story relative"',
  'className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95 group/story relative snap-start"'
);

// close the new wrapper div
c = c.replace(
  `                  <span className="text-[11px] font-bold text-zinc-700 truncate max-w-[64px] text-center">{story.title}</span>
                </div>
              ))}
          </div>

        </div>`,
  `                  <span className="text-[11px] font-bold text-zinc-700 truncate max-w-[64px] text-center">{story.title}</span>
                </div>
              ))}
            </div>
          </div>

        </div>`
);

fs.writeFileSync('src/app/(social)/results/page.tsx', c);
