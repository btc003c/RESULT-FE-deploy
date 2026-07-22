"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { 
  Search, 
  Filter, 
  MapPin, 
  Database, 
  Building2, 
  FileText, 
  TrendingUp, 
  Clock, 
  ChevronDown, 
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Users,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { SearchResultCard, SearchResult } from '@/components/search/SearchResultCard';

// --- TRENDING SEARCHES ---
const TRENDING_SEARCHES = ['Jane Doe', 'Fall 2026 Admissions', '#TechConference', 'Stanford CS Department', 'Q1 Financial Reports'];

export default function UniversalSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['All']);
  const [results, setResults] = useState<any[]>([]);
  
  // Fetch results from backend
  useEffect(() => {
    let active = true;

    if (searchQuery.length > 2) {
      setIsSearching(true);
      
      const delayDebounceFn = setTimeout(async () => {
        try {
          // You could map `activeFilters` to `type` here if you wanted specific scoping
          const typeMap: any = {
            'Organizations': 'WORKSPACE',
            'Datasets': 'DATASET',
            'Records': 'RECORD'
          };
          
          let selectedType = undefined;
          const activeType = activeFilters.find(f => typeMap[f]);
          if (activeType) {
            selectedType = typeMap[activeType];
          }

          const response = await api.search(searchQuery, selectedType);
          
          if (active) {
            // Map the generic PaginatedSearchResponse to UI format
            // Here we just mock mapping them to our new rich types for the demo
            const mappedResults: SearchResult[] = (response.results || []).map((r: any, idx: number) => {
              // Simulate different types for demo purposes based on index if backend doesn't provide
              let type: SearchResult['type'] = r.type ? r.type.toLowerCase() : 'record';
              if (!r.type) {
                if (idx % 5 === 0) type = 'user';
                else if (idx % 5 === 1) type = 'post';
                else if (idx % 5 === 2) type = 'workspace';
                else if (idx % 5 === 3) type = 'dataset';
              }
              
              return {
                type,
                id: r.id || idx.toString(),
                title: r.title || 'Result',
                subtitle: r.domainType || (type === 'user' ? 'username' : 'General'),
                verified: idx % 2 === 0,
                description: r.description || 'No description available for this result.',
                followers: type === 'user' ? Math.floor(Math.random() * 5000) : undefined,
                datasetCount: type === 'workspace' ? Math.floor(Math.random() * 50) : undefined,
                recordCount: type === 'dataset' ? Math.floor(Math.random() * 1000000) : undefined,
                workspaceId: r.workspaceId
              };
            });
            
            setResults(mappedResults);
          }
        } catch (err) {
          console.error("Search failed:", err);
          if (active) setResults([]);
        } finally {
          if (active) setIsSearching(false);
        }
      }, 500);

      return () => {
        active = false;
        clearTimeout(delayDebounceFn);
      };
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, activeFilters]);

  const toggleFilter = (filter: string) => {
    if (filter === 'All') {
      setActiveFilters(['All']);
      return;
    }
    const newFilters = activeFilters.filter(f => f !== 'All');
    if (newFilters.includes(filter)) {
      const updated = newFilters.filter(f => f !== filter);
      setActiveFilters(updated.length ? updated : ['All']);
    } else {
      setActiveFilters([...newFilters, filter]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-zinc-900 font-sans selection:bg-[#FFC82A]/20 flex flex-col">
      
      {/* 1. COMPACT NAVBAR (For when scrolled or just standard top) */}
      <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-zinc-200 sticky top-0 z-50 flex items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFC82A] to-purple-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">RH</span>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-zinc-900 hidden sm:block">ResultHub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors">Sign In</Link>
          <Link href="/signup" className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors">Create Portal</Link>
        </div>
      </header>

      {/* 2. HERO SEARCH SECTION */}
      <div className="bg-white border-b border-zinc-200 relative overflow-hidden transition-all duration-500 ease-in-out">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-50 to-emerald-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        
        <div className={`max-w-4xl mx-auto px-4 w-full transition-all duration-500 ${searchQuery ? 'py-8' : 'py-20 md:py-32'}`}>
          <div className="text-center relative z-10">
            <AnimatePresence>
              {!searchQuery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 mb-6">
                    The Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC82A] to-purple-600">Data Space</span>
                  </h1>
                  <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
                    Search across thousands of organizations, millions of public datasets, and verified records instantly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Massive Search Bar */}
            <motion.div 
              layout
              className={`relative mx-auto bg-white rounded-3xl transition-all duration-300 ${
                isFocused ? 'shadow-[0_8px_30px_rgb(0,0,0,0.08)] scale-[1.02] border-[#FFC82A]/30' : 'shadow-sm border-zinc-200'
              } border-2 overflow-hidden flex flex-col`}
            >
              <div className="flex items-center px-4">
                <Search className={`w-7 h-7 ml-2 transition-colors ${isFocused ? 'text-[#FFC82A]' : 'text-zinc-400'}`} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Search organizations, datasets, or enter an ID number..."
                  className="w-full py-5 md:py-6 px-5 text-lg md:text-xl font-medium text-zinc-900 bg-transparent outline-none placeholder:text-zinc-400"
                />
                
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full transition-colors mr-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                <button className="hidden sm:flex items-center gap-2 px-8 py-3.5 bg-[#FFC82A] hover:bg-[#E5B426] text-white font-bold rounded-2xl transition-colors shadow-sm shadow-[#FFC82A]/20 my-2 mr-1">
                  Search
                </button>
              </div>

              {/* Advanced inline filters (only show when focused or typing) */}
              <AnimatePresence>
                {(isFocused || searchQuery) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-zinc-100 bg-zinc-50/50 px-6 py-3 flex items-center justify-between overflow-x-auto scrollbar-hide"
                  >
                    <div className="flex items-center gap-6 whitespace-nowrap text-sm font-medium text-zinc-600">
                      {['All', 'People', 'Posts', 'Organizations', 'Datasets'].map((scope) => (
                        <label key={scope} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="searchScope" 
                            value={scope}
                            checked={activeFilters.includes(scope)}
                            onChange={() => setActiveFilters([scope])}
                            className="w-4 h-4 text-[#FFC82A] focus:ring-[#FFC82A] border-zinc-300" 
                          />
                          <span className={`transition-colors ${activeFilters.includes(scope) ? 'text-zinc-900 font-bold' : 'group-hover:text-zinc-900'}`}>
                            {scope}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Trending Chips */}
            <AnimatePresence>
              {!searchQuery && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 flex flex-wrap items-center justify-center gap-3"
                >
                  <span className="text-sm font-bold text-zinc-400 flex items-center gap-1.5 mr-2">
                    <TrendingUp className="w-4 h-4" /> Trending:
                  </span>
                  {TRENDING_SEARCHES.map((term, i) => (
                    <button 
                      key={i}
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-sm font-medium text-zinc-600 hover:border-zinc-300 hover:shadow-sm hover:text-zinc-900 transition-all cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN COMMAND CENTER (Only visible when searching or exploring) */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Sidebar Filters */}
            <div className="hidden lg:block col-span-1 space-y-8">
              <div className="flex items-center gap-2 mb-6 text-zinc-900 font-extrabold text-lg">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </div>
              
              {/* Filter Category: Entity Type */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Entity Type</h4>
                <div className="space-y-2">
                  {['All', 'People', 'Posts', 'Organizations', 'Datasets'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilters.includes(filter) 
                          ? 'bg-[#FFC82A]/10 text-[#FFC82A]' 
                          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                      }`}
                    >
                      {filter}
                      {activeFilters.includes(filter) && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Category: Industry */}
              <div className="space-y-4 pt-6 border-t border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Industry Sector</h4>
                <div className="space-y-3">
                  {['Education', 'Government', 'Healthcare', 'Corporate', 'Non-Profit'].map(ind => (
                    <label key={ind} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-[#FFC82A] focus:ring-[#FFC82A]" />
                      <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">{ind}</span>
                    </label>
                  ))}
                </div>
                <button className="text-sm font-bold text-[#FFC82A] hover:underline">Show all sectors</button>
              </div>
            </div>

            {/* Results Feed */}
            <div className="col-span-1 lg:col-span-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-extrabold text-zinc-900">
                  {isSearching ? 'Searching...' : `Search Results for "${searchQuery}"`}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-500">Sort by:</span>
                  <select className="bg-transparent border border-zinc-200 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-900 outline-none focus:border-[#FFC82A]">
                    <option>Most Relevant</option>
                    <option>Newest First</option>
                    <option>Popularity</option>
                  </select>
                </div>
              </div>

              {isSearching ? (
                /* Loading Skeletons */
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 animate-pulse flex gap-4">
                      <div className="w-12 h-12 bg-zinc-100 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-4 bg-zinc-100 rounded w-1/3" />
                        <div className="h-3 bg-zinc-100 rounded w-1/4" />
                        <div className="h-3 bg-zinc-100 rounded w-2/3 pt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Actual Results */
                <div className="space-y-4">
                  {results.length === 0 && !isSearching && searchQuery.length > 2 ? (
                    <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center text-zinc-500">
                      No results found for "{searchQuery}".
                    </div>
                  ) : (
                    results.map((result, idx) => (
                      <SearchResultCard key={idx} result={result} />
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
