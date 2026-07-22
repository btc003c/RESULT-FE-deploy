"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  AlertCircle, 
  Building2, 
  Database, 
  FileText,
  TrendingUp,
  SlidersHorizontal,
  X,
  Globe2,
  Users,
  Briefcase
} from "lucide-react";

const TRENDING_SEARCHES = ['Jane Doe', 'Fall 2026 Admissions', '#TechConference', 'Stanford CS', 'Q1 Reports'];

type ZoneType = 'GLOBAL' | 'SOCIAL' | 'RESULTHUB';

export default function DualZoneSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const [isFocused, setIsFocused] = useState(false);
  
  const [activeZone, setActiveZone] = useState<ZoneType>('GLOBAL');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('All');
  
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('relevance');

  // Change sub-filter to 'All' when switching zones
  useEffect(() => {
    setActiveSubFilter('All');
  }, [activeZone]);

  useEffect(() => {
    const fetchResults = async () => {
      // If there's no query AND no specific sub-filter selected, show nothing
      if (!debouncedQuery.trim() && activeSubFilter === 'All') {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const typeMap: any = {
          'People': 'USER',
          'Posts': 'FEED_POST',
          'Complaints': 'COMPLAINT',
          'Organizations': 'WORKSPACE',
          'Datasets': 'DATASET',
          'Records': 'RECORD'
        };
        
        let selectedType = typeMap[activeSubFilter];
        
        // If Global and 'All', it passes undefined type so backend searches everything.
        // If Social and 'All', we need a way to filter to just Social types. 
        // Our backend doesn't support array of types, so 'All' in a specific zone will just fetch Global for now, 
        // and we will filter them in memory, or we can just fetch Global.
        
        const data = await api.search.global(debouncedQuery, selectedType);
        let fetched = data.results || [];

        // In-memory zone filtering if 'All' is selected for a specific zone
        if (!selectedType && activeZone !== 'GLOBAL') {
          fetched = fetched.filter((r: any) => {
            if (activeZone === 'SOCIAL') return ['USER', 'FEED_POST', 'COMPLAINT'].includes(r.type);
            if (activeZone === 'RESULTHUB') return ['WORKSPACE', 'DATASET', 'RECORD'].includes(r.type);
            return true;
          });
        }
        
        setResults(fetched);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [debouncedQuery, activeSubFilter, activeZone]);

  const sortedResults = [...results].sort((a, b) => {
    if (sortOrder === 'a-z') return a.title.localeCompare(b.title);
    if (sortOrder === 'z-a') return b.title.localeCompare(a.title);
    return 0;
  });

  const getThemeColors = () => {
    if (activeZone === 'SOCIAL') return { bg: 'bg-orange-50/50', border: 'border-orange-200', text: 'text-orange-600', shadow: 'shadow-[0_8px_30px_rgb(249,115,22,0.15)]', focusRing: 'focus:border-orange-400' };
    if (activeZone === 'RESULTHUB') return { bg: 'bg-indigo-50/50', border: 'border-indigo-200', text: 'text-indigo-600', shadow: 'shadow-[0_8px_30px_rgb(99,102,241,0.15)]', focusRing: 'focus:border-indigo-400' };
    return { bg: 'bg-zinc-50/80', border: 'border-zinc-200', text: 'text-zinc-600', shadow: 'shadow-md', focusRing: 'focus:border-zinc-400' };
  };

  const theme = getThemeColors();

  return (
    <div className="flex-1 w-full max-w-[800px] mx-auto pb-20 relative">
      
      {/* 1. TOP NAV & ZONE SWITCHER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-200 pt-6 pb-4 px-4 md:px-6">
        <h1 className="text-2xl font-black mb-6 text-zinc-900 tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-zinc-400" />
          Universal Search
        </h1>
        
        {/* Zone Segment Control */}
        <div className="flex bg-zinc-100/80 p-1.5 rounded-2xl mb-6 relative">
          <button onClick={() => setActiveZone('GLOBAL')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 ${activeZone === 'GLOBAL' ? 'text-zinc-900 shadow-sm bg-white' : 'text-zinc-500 hover:text-zinc-700'}`}>
            <Globe2 className="w-4 h-4" /> Global
          </button>
          <button onClick={() => setActiveZone('SOCIAL')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 ${activeZone === 'SOCIAL' ? 'text-orange-600 shadow-sm bg-white' : 'text-zinc-500 hover:text-zinc-700'}`}>
            <Users className="w-4 h-4" /> Social
          </button>
          <button onClick={() => setActiveZone('RESULTHUB')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 ${activeZone === 'RESULTHUB' ? 'text-indigo-600 shadow-sm bg-white' : 'text-zinc-500 hover:text-zinc-700'}`}>
            <Briefcase className="w-4 h-4" /> Result Hub
          </button>
        </div>

        {/* Dynamic Search Bar */}
        <motion.div 
          layout
          className={`relative w-full bg-white rounded-2xl transition-all duration-300 ${isFocused ? theme.shadow : 'shadow-sm'} border-2 ${isFocused ? theme.border : 'border-zinc-200'} overflow-hidden flex flex-col`}
        >
          <div className="flex items-center px-4">
            <Search className={`w-5 h-5 ml-2 transition-colors ${isFocused || searchQuery ? theme.text : 'text-zinc-400'}`} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={`Search ${activeZone === 'SOCIAL' ? 'people and posts' : activeZone === 'RESULTHUB' ? 'organizations and datasets' : 'everything'}...`}
              className="w-full py-4 px-4 text-base font-bold text-zinc-900 bg-transparent outline-none placeholder:text-zinc-400 placeholder:font-semibold"
            />
            
            {isLoading && (
              <div className="mr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`animate-spin ${theme.text}`}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              </div>
            )}
            {searchQuery && !isLoading && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full transition-colors mr-2 bg-zinc-100 hover:bg-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Contextual Sub-filters */}
          <div className={`border-t border-zinc-100 px-5 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide ${theme.bg}`}>
            <span className="text-xs font-black uppercase tracking-wider text-zinc-400 mr-2">Filters:</span>
            
            <FilterPill label="All" active={activeSubFilter === 'All'} onClick={() => setActiveSubFilter('All')} zone={activeZone} />
            
            {activeZone === 'SOCIAL' && (
              <>
                <FilterPill label="People" active={activeSubFilter === 'People'} onClick={() => setActiveSubFilter('People')} zone={activeZone} />
                <FilterPill label="Posts" active={activeSubFilter === 'Posts'} onClick={() => setActiveSubFilter('Posts')} zone={activeZone} />
                <FilterPill label="Complaints" active={activeSubFilter === 'Complaints'} onClick={() => setActiveSubFilter('Complaints')} zone={activeZone} />
              </>
            )}

            {activeZone === 'RESULTHUB' && (
              <>
                <FilterPill label="Organizations" active={activeSubFilter === 'Organizations'} onClick={() => setActiveSubFilter('Organizations')} zone={activeZone} />
                <FilterPill label="Datasets" active={activeSubFilter === 'Datasets'} onClick={() => setActiveSubFilter('Datasets')} zone={activeZone} />
                <FilterPill label="Records" active={activeSubFilter === 'Records'} onClick={() => setActiveSubFilter('Records')} zone={activeZone} />
              </>
            )}

            {activeZone === 'GLOBAL' && (
              <span className="text-xs font-bold text-zinc-500 italic">Select a Zone for specific filters</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* 2. RESULTS FEED */}
      <div className="px-4 md:px-6 pt-4">
        {/* Results Header */}
        <AnimatePresence>
          {(searchQuery || activeSubFilter !== 'All') && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-4 mb-6"
            >
              <h2 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                {isLoading ? 'Searching...' : `Results ${searchQuery ? `for "${searchQuery}"` : `in ${activeSubFilter}`}`}
              </h2>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent text-xs font-bold text-zinc-600 outline-none cursor-pointer hover:text-zinc-900 transition-colors"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="a-z">A to Z</option>
                  <option value="z-a">Z to A</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 pb-10">
          {/* Initial Empty State */}
          {!searchQuery && activeSubFilter === 'All' && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border shadow-sm ${activeZone === 'SOCIAL' ? 'bg-orange-50 border-orange-100 text-orange-400' : activeZone === 'RESULTHUB' ? 'bg-indigo-50 border-indigo-100 text-indigo-400' : 'bg-zinc-50 border-zinc-100 text-zinc-300'}`}>
                {activeZone === 'SOCIAL' ? <Users className="w-10 h-10" /> : activeZone === 'RESULTHUB' ? <Briefcase className="w-10 h-10" /> : <Globe2 className="w-10 h-10" />}
              </div>
              <p className="font-bold text-xl text-zinc-600 mb-6">Explore {activeZone === 'SOCIAL' ? 'the Community' : activeZone === 'RESULTHUB' ? 'the Data Space' : 'Everything'}</p>
              
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mr-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Trending
                </span>
                {TRENDING_SEARCHES.map((term, i) => (
                  <button key={i} onClick={() => setSearchQuery(term)} className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-bold text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 transition-all shadow-sm">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {sortedResults.length === 0 && !isLoading && (searchQuery || activeSubFilter !== 'All') && (
            <div className="bg-white border-2 border-dashed border-zinc-200 rounded-3xl p-10 text-center text-zinc-500 mt-8">
              <Search className="w-10 h-10 mx-auto text-zinc-300 mb-4" />
              <p className="font-black text-lg text-zinc-900 mb-1">No matches found</p>
              <p className="text-sm font-medium">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {/* Results List */}
          {sortedResults.map((result, idx) => (
            <div key={`${result.id}-${idx}`} className="animate-in slide-in-from-bottom-4 fade-in fill-mode-both" style={{ animationDelay: `${idx * 40}ms` }}>
              <SearchResultCard result={result} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sub-filter button component
function FilterPill({ label, active, onClick, zone }: { label: string, active: boolean, onClick: () => void, zone: ZoneType }) {
  let activeClass = 'bg-zinc-900 text-white border-zinc-900';
  if (zone === 'SOCIAL') activeClass = 'bg-orange-500 text-white border-orange-500';
  if (zone === 'RESULTHUB') activeClass = 'bg-indigo-500 text-white border-indigo-500';

  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1 rounded-lg text-xs font-bold transition-all border-2 
        ${active ? activeClass : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'}`}
    >
      {label}
    </button>
  );
}

function SearchResultCard({ result }: { result: any }) {
  // USER RESULT
  if (result.type === "USER") {
    return (
      <Link href={`/profile/${result.id}`} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-orange-400 to-amber-300 text-white flex items-center justify-center font-black shrink-0">
          {result.avatar ? (
            <img src={`data:image/jpeg;base64,${result.avatar}`} alt={result.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg">{result.title[0]?.toUpperCase() || 'U'}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base text-zinc-900 truncate group-hover:text-orange-600 transition-colors">{result.title}</p>
          <p className="text-xs font-bold text-zinc-400 truncate">{result.description}</p>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest shrink-0 hidden sm:block">Person</div>
      </Link>
    );
  }

  // FEED POST RESULT
  if (result.type === "FEED_POST") {
    return (
      <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group">
        <div className="flex items-center gap-3 mb-2">
           <div className="w-7 h-7 rounded-full bg-zinc-200 overflow-hidden shrink-0">
             {result.author?.profilePictureBase64 && (
               <img src={`data:image/jpeg;base64,${result.author.profilePictureBase64}`} className="w-full h-full object-cover" />
             )}
           </div>
           <div>
             <span className="text-sm font-bold text-zinc-900 block leading-none hover:underline">{result.author?.name || 'User'}</span>
             <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mt-1">
               {result.createdAt ? formatDistanceToNow(new Date(result.createdAt)) + ' ago' : ''}
             </span>
           </div>
           <div className="ml-auto px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest shrink-0">Post</div>
        </div>
        <p className="font-medium text-sm text-zinc-700 leading-relaxed line-clamp-3">
          {result.description}
        </p>
      </div>
    );
  }

  // COMPLAINT RESULT
  if (result.type === "COMPLAINT") {
    return (
      <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-red-300 transition-all relative overflow-hidden cursor-pointer group flex gap-3">
        <div className="w-1.5 h-full absolute left-0 top-0 bg-red-500 group-hover:w-2 transition-all" />
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 ml-1">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-zinc-900 text-sm truncate">{result.title}</h3>
            <span className="inline-flex shrink-0 px-2 py-0.5 rounded text-red-700 bg-red-50 text-[9px] font-black uppercase tracking-widest border border-red-100">
              {result.priority || "Complaint"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-medium line-clamp-2 leading-relaxed">
            {result.description}
          </p>
        </div>
      </div>
    );
  }

  // WORKSPACE / DATASET / RECORD RESULT
  let icon = <Database className="w-5 h-5 text-indigo-600" />;
  let colorClass = "bg-indigo-50 border-indigo-100 text-indigo-600";
  let hoverBorder = "hover:border-indigo-300";
  
  if (result.type === "WORKSPACE") {
    icon = <Building2 className="w-5 h-5 text-emerald-600" />;
    colorClass = "bg-emerald-50 border-emerald-100 text-emerald-600";
    hoverBorder = "hover:border-emerald-300";
  } else if (result.type === "RECORD") {
    icon = <FileText className="w-5 h-5 text-sky-600" />;
    colorClass = "bg-sky-50 border-sky-100 text-sky-600";
    hoverBorder = "hover:border-sky-300";
  }

  return (
    <div className={`p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md ${hoverBorder} transition-all cursor-pointer flex items-start gap-4 group`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colorClass} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${colorClass}`}>
            {result.type}
          </span>
        </div>
        <h3 className="font-bold text-zinc-900 text-sm truncate leading-tight group-hover:text-primary transition-colors">{result.title}</h3>
        <p className="text-xs text-zinc-500 font-medium line-clamp-2 mt-1 leading-relaxed">{result.description}</p>
      </div>
    </div>
  );
}
