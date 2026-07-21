"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import {
  GraduationCap, Landmark, Trophy, Vote, TrendingUp, Clapperboard,
  Monitor, Scale, Heart, Briefcase, MapPin, ChevronRight, Play, Activity, Plus
} from 'lucide-react';
import CreateResultModal from "@/components/results/CreateResultModal";

export default function ExplorePage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [footballLive, setFootballLive] = useState<any[]>([]);
  const [cricketLive, setCricketLive] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createAccessType, setCreateAccessType] = useState('OPEN');
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const liveScrollRef = useRef<HTMLDivElement>(null);
  const ringsScrollRef = useRef<HTMLDivElement>(null);

  const scrollFeatured = (dir: 'left' | 'right') => {
    if (featuredScrollRef.current) {
      featuredScrollRef.current.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
    }
  };

  const scrollRings = (dir: 'left' | 'right') => {
    if (ringsScrollRef.current) {
      ringsScrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const scrollLive = (dir: 'left' | 'right') => {
    if (liveScrollRef.current) {
      liveScrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Datasets
      const dsRes = await api.datasets.getPublic().catch(() => ({ content: [] }));
      setDatasets(dsRes.content || []);

      // Fetch Football Live
      const fbRes = await fetch('/api/sports/football?status=inprogress').then(r => r.json()).catch(() => ({}));
      let fb: any[] = [];
      if (fbRes.success && fbRes.data) {
        fbRes.data.forEach((league: any) => {
          if (league.matches) {
            league.matches.forEach((m: any) => {
              fb.push({
                id: m.id,
                teamA: m.teams?.home?.name || 'Home',
                teamB: m.teams?.away?.name || 'Away',
                logoA: m.teams?.home?.badge,
                logoB: m.teams?.away?.badge,
                scoreA: m.score?.current?.home,
                scoreB: m.score?.current?.away,
                status: m.status_detail || m.status || 'LIVE',
                leagueName: league.league?.name || 'Football',
              });
            });
          }
        });
      }
      setFootballLive(fb);

      // Fetch Cricket Live
      const crRes = await fetch('/api/sports/cricket?endpoint=currentMatches').then(r => r.json()).catch(() => ({}));
      let cr: any[] = [];
      if (crRes.status === 'success' && crRes.data) {
        const liveCr = crRes.data.filter((m: any) => m.matchStarted && !m.matchEnded);
        cr = liveCr.map((m: any) => {
          const score1 = m.score?.[0];
          const score2 = m.score?.[1];
          return {
            id: m.id,
            name: m.name,
            teamA: m.teams?.[0] || 'TBA',
            teamB: m.teams?.[1] || 'TBA',
            logoA: m.teamInfo?.[0]?.img,
            logoB: m.teamInfo?.[1]?.img,
            scoreStr: score1 ? `${score1.r}/${score1.w} (${score1.o})` : 'Live',
            status: m.status || 'Live',
          };
        });
      }
      setCricketLive(cr);

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { name: 'Academic', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200/50', path: '/search?category=ACADEMIC' },
    { name: 'Government', icon: Landmark, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200/50', path: '/search?category=GOVERNMENT' },
    { name: 'Sports', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200/50', path: '/results/sports' },
    { name: 'Politics', icon: Vote, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200/50', path: '/search?category=POLITICS' },
    { name: 'Finance', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200/50', path: '/search?category=FINANCE' },
    { name: 'Entertainment', icon: Clapperboard, color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-200/50', path: '/search?category=ENTERTAINMENT' },
    { name: 'Technology', icon: Monitor, color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-200/50', path: '/search?category=TECH' },
    { name: 'Law', icon: Scale, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200/50', path: '/search?category=LAW' },
    { name: 'Healthcare', icon: Heart, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200/50', path: '/search?category=HEALTHCARE' },
    { name: 'Business', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200/50', path: '/search?category=BUSINESS' },
    { name: 'Hyper Local', icon: MapPin, color: 'text-lime-600', bg: 'bg-lime-100', border: 'border-lime-200/50', path: '/search?category=HYPERLOCAL' },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAFAFA] font-sans text-zinc-950">

      {/* App Bar / Hero */}
      <div className="pt-8 pb-12 px-6 lg:px-12 bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-2xl font-black text-white">R</span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-950">ResultHub</h1>
              <p className="text-zinc-500 font-medium text-sm">Explore the Global Catalog</p>
            </div>
          </div>
          {/* Action Area: Create Card & Search (Based on Sketch) */}
          <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl items-center">

            {/* Left: Create Result Strip */}
            <div className="bg-white border-2 border-zinc-200 rounded-full h-[64px] p-2 flex items-center shadow-sm w-full lg:w-auto lg:shrink-0 min-w-0">

              <div className="hidden sm:flex items-center gap-2 px-3 border-r border-zinc-200 shrink-0">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                  R
                </div>
                <h3 className="text-zinc-800 font-black text-[13px] uppercase tracking-wider whitespace-nowrap">Create Result</h3>
              </div>

              <div className="flex gap-2 pl-0 sm:pl-3 w-full min-w-0">
                <button
                  onClick={() => { setCreateAccessType('OPEN'); setIsCreateModalOpen(true); }}
                  className="flex-1 h-[44px] pl-2 pr-3 sm:px-5 text-[11px] sm:text-xs font-bold rounded-full transition-colors bg-[#FFC82A] hover:bg-[#E5B426] text-white flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                  </div>
                  <span className="sm:hidden">Open</span>
                  <span className="hidden sm:inline">Open Result</span>
                </button>
                <button
                  onClick={() => { setCreateAccessType('CLOSED'); setIsCreateModalOpen(true); }}
                  className="flex-1 h-[44px] pl-2 pr-3 sm:px-5 text-[11px] sm:text-xs font-bold rounded-full transition-colors bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600/10 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <span className="sm:hidden">Closed</span>
                  <span className="hidden sm:inline">Closed Result</span>
                </button>
              </div>
            </div>

            {/* Right: Search Bar */}
            <div className="w-full lg:flex-1 flex items-center min-w-0 mt-2 lg:mt-0">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full h-[56px] sm:h-[64px] pl-12 sm:pl-14 pr-[90px] sm:pr-[110px] bg-transparent border-2 border-zinc-300 rounded-full text-base sm:text-lg font-semibold text-zinc-800 focus:outline-none focus:border-zinc-400 transition-all shadow-sm"
                  placeholder="Search results..."
                />
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[22px] sm:h-[22px]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>

                <div className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2">
                  <button className="px-4 sm:px-6 h-[48px] sm:h-[50px] bg-[#FFC82A] hover:bg-[#E5B426] text-white text-sm sm:text-base font-bold rounded-full transition-colors shadow-sm">
                    Search
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Results Bar */}
          <div className="max-w-5xl mt-6 pt-6 border-t border-zinc-100">
            <div className="relative group/scroll w-full">
              <button onClick={() => scrollRings('left')} className="absolute left-0 top-[35%] -translate-y-1/2 z-30 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all opacity-0 group-hover/scroll:opacity-100 -ml-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button onClick={() => scrollRings('right')} className="absolute right-0 top-[35%] -translate-y-1/2 z-30 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all opacity-0 group-hover/scroll:opacity-100 -mr-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
              <div ref={ringsScrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar items-center px-2 snap-x pb-2">
                {[
                  { id: 'm2', type: 'live', title: 'IND v AUS', text: '🏏', color: 'bg-emerald-100', textCol: 'text-emerald-600' },
                  { id: 'm4', type: 'live', title: 'US Election', text: '🗳️', color: 'bg-red-100', textCol: 'text-red-600' },
                  { id: 'm6', type: 'live', title: 'RMA v BAR', text: '⚽', color: 'bg-blue-100', textCol: 'text-blue-600' },
                  { id: 'm8', type: 'live', title: 'UK Election', text: '🗳️', color: 'bg-indigo-100', textCol: 'text-indigo-600' },
                  { id: 'm10', type: 'live', title: 'LAL v GSW', text: '🏀', color: 'bg-orange-100', textCol: 'text-orange-600' },
                  { id: 'm12', type: 'live', title: 'News', text: '📰', color: 'bg-rose-100', textCol: 'text-rose-600' },
                  { id: 'm13', type: 'live', title: 'F1 Race', text: '🏎️', color: 'bg-red-100', textCol: 'text-red-600' },
                  { id: 'm15', type: 'live', title: 'Tennis', text: '🎾', color: 'bg-lime-100', textCol: 'text-lime-600' },
                  { id: 'm18', type: 'live', title: 'Boxing', text: '🥊', color: 'bg-red-100', textCol: 'text-red-600' },
                  { id: 'm1', type: 'flash', title: 'ARS v CHE', text: '⚽', color: 'bg-blue-100', textCol: 'text-blue-600' },
                  { id: 'm3', type: 'flash', title: 'Exam 26', text: '🎓', color: 'bg-purple-100', textCol: 'text-purple-600' },
                  { id: 'm5', type: 'flash', title: 'NAVI v FAZ', text: '🎮', color: 'bg-amber-100', textCol: 'text-amber-600' },
                  { id: 'm7', type: 'flash', title: 'Market Wrap', text: '📈', color: 'bg-emerald-100', textCol: 'text-emerald-600' },
                  { id: 'm9', type: 'flash', title: 'Tech Stocks', text: '💻', color: 'bg-slate-100', textCol: 'text-slate-600' },
                  { id: 'm11', type: 'flash', title: 'Weather', text: '🌪️', color: 'bg-teal-100', textCol: 'text-teal-600' },
                  { id: 'm14', type: 'flash', title: 'Tech IPO', text: '💸', color: 'bg-green-100', textCol: 'text-green-600' },
                  { id: 'm16', type: 'flash', title: 'Olympics', text: '🥇', color: 'bg-yellow-100', textCol: 'text-yellow-600' },
                  { id: 'm17', type: 'flash', title: 'Golf', text: '⛳', color: 'bg-emerald-100', textCol: 'text-emerald-600' },
                ].map(story => (
                  <div key={story.id} className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95 group/story relative snap-start">
                    <div className="relative rounded-full p-[3px]">

                      {/* Ring Logic (Different from Home Page) */}
                      {story.type === 'flash' ? (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00A896] to-[#FFC82A] shadow-inner"></div>
                      ) : (
                        <div className="absolute inset-0 rounded-full bg-blue-600 shadow-inner"></div>
                      )}

                      <div className={`relative z-10 w-14 h-14 rounded-full border-[3px] border-white flex items-center justify-center font-black text-xl ${story.color} ${story.textCol} shadow-sm`}>
                        {story.text}
                      </div>
                      {story.type === 'live' && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 bg-blue-600 text-white text-[8px] font-black tracking-widest px-1.5 py-[2px] rounded-full border-2 border-white shadow-sm">
                          LIVE
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-700 truncate max-w-[64px] text-center">{story.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 space-y-16">

        {/* Featured Trending Carousel */}
        <section className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black tracking-tight text-zinc-950 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              Trending Today
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => scrollFeatured('left')} className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 hover:border-zinc-300 transition-all text-zinc-500 hover:text-zinc-900 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button onClick={() => scrollFeatured('right')} className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 hover:border-zinc-300 transition-all text-zinc-500 hover:text-zinc-900 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>

          <div ref={featuredScrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 snap-x pt-2 px-1 -mx-1">

            {/* Sensational Result 1 */}
            <Link href="/search?category=TECH" className="snap-start shrink-0 w-[300px] sm:w-[340px] h-[180px] rounded-3xl bg-gradient-to-br from-rose-500 to-red-700 border border-red-400/30 p-6 flex flex-col justify-between group overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(225,29,72,0.3)] transition-all hover:-translate-y-1">
              <div className="absolute -right-10 -bottom-10 opacity-20 text-9xl">💻</div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-950 bg-white/30 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-950 animate-pulse"></span> SENSATIONAL TODAY
                </span>
                <h3 className="text-xl font-black text-white mt-4 leading-tight group-hover:text-rose-50 transition-colors">
                  Global IT Outage Resolved Worldwide
                </h3>
              </div>
              <div className="flex items-center gap-2 text-rose-50 font-bold text-sm bg-black/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                View Coverage <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Cricket Live */}
            <Link href="/results/sports/cricket" className="snap-start shrink-0 w-[300px] sm:w-[340px] h-[180px] rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 border border-emerald-400/30 p-6 flex flex-col justify-between group overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.3)] transition-all hover:-translate-y-1">
              <div className="absolute -right-10 -bottom-10 opacity-20 text-9xl">🏏</div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950 bg-white/30 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">LIVE CRICKET</span>
                <h3 className="text-xl font-black text-white mt-4 leading-tight group-hover:text-emerald-50 transition-colors">
                  {cricketLive.length > 0 ? cricketLive[0].name : "IND vs AUS Final Series"}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-emerald-50 font-bold text-sm bg-black/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                View Matches <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Football Live */}
            <Link href="/results/sports/football" className="snap-start shrink-0 w-[300px] sm:w-[340px] h-[180px] rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 border border-blue-400/30 p-6 flex flex-col justify-between group overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] transition-all hover:-translate-y-1">
              <div className="absolute -right-10 -bottom-10 opacity-20 text-9xl">⚽</div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-950 bg-white/30 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">FOOTBALL ACTION</span>
                <h3 className="text-xl font-black text-white mt-4 leading-tight group-hover:text-blue-50 transition-colors">
                  {footballLive.length > 0 ? `${footballLive[0].leagueName} Live` : "Champions League Final"}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-blue-50 font-bold text-sm bg-black/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                View Matches <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Sensational Result 2 */}
            <Link href="/search?category=SPORTS" className="snap-start shrink-0 w-[300px] sm:w-[340px] h-[180px] rounded-3xl bg-gradient-to-br from-purple-500 to-fuchsia-700 border border-purple-400/30 p-6 flex flex-col justify-between group overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(168,85,247,0.3)] transition-all hover:-translate-y-1">
              <div className="absolute -right-10 -bottom-10 opacity-20 text-9xl">🏅</div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-950 bg-white/30 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5 w-fit">
                  TRENDING TODAY
                </span>
                <h3 className="text-xl font-black text-white mt-4 leading-tight group-hover:text-purple-50 transition-colors">
                  Paris 2024 Olympic Medal Tally Updated
                </h3>
              </div>
              <div className="flex items-center gap-2 text-purple-50 font-bold text-sm bg-black/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                View Rankings <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Market Trending */}
            <Link href="/search?category=FINANCE" className="snap-start shrink-0 w-[300px] sm:w-[340px] h-[180px] rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400/30 p-6 flex flex-col justify-between group overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.3)] transition-all hover:-translate-y-1">
              <div className="absolute -right-10 -bottom-10 opacity-20 text-9xl">🚀</div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-950 bg-white/30 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5 w-fit">
                  MARKET HOT TODAY
                </span>
                <h3 className="text-xl font-black text-white mt-4 leading-tight group-hover:text-amber-50 transition-colors">
                  Tech Giant AI Earnings Surprise Revealed
                </h3>
              </div>
              <div className="flex items-center gap-2 text-amber-50 font-bold text-sm bg-black/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                View Charts <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </section>

        {/* Live Now */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-black tracking-tight text-zinc-950">Live Now</h2>
            <div className="flex items-center gap-2 ml-auto hidden sm:flex">
              <button onClick={() => scrollLive('left')} className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 hover:border-zinc-300 transition-all text-zinc-500 hover:text-zinc-900 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button onClick={() => scrollLive('right')} className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 hover:border-zinc-300 transition-all text-zinc-500 hover:text-zinc-900 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>

          <div ref={liveScrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x pt-2 px-1 -mx-1">
            {cricketLive.map(match => (
              <Link href={`/results/sports/cricket`} key={match.id} className="snap-start shrink-0 w-[280px] bg-white border border-zinc-200/80 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">CRICKET</span>
                  <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Live</span>
                </div>
                <div className="font-bold text-zinc-600 text-sm mb-1 truncate">{match.teamA} vs {match.teamB}</div>
                <div className="text-xl font-black text-zinc-950 mb-2">{match.scoreStr}</div>
                <div className="text-xs font-semibold text-emerald-600 truncate">{match.status}</div>
              </Link>
            ))}

            {footballLive.map(match => (
              <Link href={`/results/sports/football`} key={match.id} className="snap-start shrink-0 w-[280px] bg-white border border-zinc-200/80 rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">FOOTBALL</span>
                  <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Live</span>
                </div>
                <div className="font-bold text-zinc-600 text-sm mb-1 truncate">{match.teamA} vs {match.teamB}</div>
                <div className="text-xl font-black text-zinc-950 mb-2">{match.scoreA} - {match.scoreB}</div>
                <div className="text-xs font-semibold text-blue-600 truncate">{match.status}</div>
              </Link>
            ))}

            {/* Live Finance / Market */}
            <Link href="/search?category=FINANCE" className="snap-start shrink-0 w-[280px] bg-white border border-zinc-200/80 rounded-2xl p-5 hover:border-orange-500 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">FINANCE</span>
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Live</span>
              </div>
              <div className="font-bold text-zinc-600 text-sm mb-1 truncate">Global Market Index</div>
              <div className="text-xl font-black text-zinc-950 mb-2">24,852.30</div>
              <div className="text-xs font-semibold text-orange-500 truncate">+1.2% ▲ Today</div>
            </Link>

            {/* Live Politics / Election */}
            <Link href="/search?category=POLITICS" className="snap-start shrink-0 w-[280px] bg-white border border-zinc-200/80 rounded-2xl p-5 hover:border-purple-500 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100">POLITICS</span>
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Live</span>
              </div>
              <div className="font-bold text-zinc-600 text-sm mb-1 truncate">Mayoral Election Count</div>
              <div className="text-xl font-black text-zinc-950 mb-2">52% to 48%</div>
              <div className="text-xs font-semibold text-purple-600 truncate">90% votes counted</div>
            </Link>

            {/* Live Crypto */}
            <Link href="/search?category=FINANCE" className="snap-start shrink-0 w-[280px] bg-white border border-zinc-200/80 rounded-2xl p-5 hover:border-amber-500 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">CRYPTO</span>
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Live</span>
              </div>
              <div className="font-bold text-zinc-600 text-sm mb-1 truncate">Bitcoin (BTC)</div>
              <div className="text-xl font-black text-zinc-950 mb-2">$68,420.00</div>
              <div className="text-xs font-semibold text-emerald-500 truncate">+3.4% ▲ Last 24h</div>
            </Link>
          </div>

          <div className="mt-4 flex justify-center">
            <Link href="/results/sports" className="text-sm font-bold text-[#FFC82A] hover:text-[#E5B426] flex items-center gap-1 transition-colors">
              View All Live <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 11 Categories */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#FFC82A]" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <h2 className="text-xl font-black tracking-tight text-zinc-950">Browse Categories</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link href={cat.path} key={cat.name} className="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cat.bg} border ${cat.border} group-hover:scale-105 group-hover:shadow-md transition-all`}>
                    <Icon className={`w-7 h-7 ${cat.color}`} />
                  </div>
                  <span className="text-xs font-bold text-zinc-600 text-center">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Grid for Trending & Recent */}
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Trending Results */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500" strokeWidth="2.5"><path d="M12 2L10.29 4.34C9.56 5.35 9.07 6.49 8.87 7.7L8.74 8.6L7.86 8.79C6.55 9.07 5.41 9.77 4.6 10.8L3 12.8L4.6 14.8C5.41 15.83 6.55 16.53 7.86 16.81L8.74 17L8.87 17.9C9.07 19.11 9.56 20.25 10.29 21.26L12 23.6L13.71 21.26C14.44 20.25 14.93 19.11 15.13 17.9L15.26 17L16.14 16.81C17.45 16.53 18.59 15.83 19.4 14.8L21 12.8L19.4 10.8C18.59 9.77 17.45 9.07 16.14 8.79L15.26 8.6L15.13 7.7C14.93 6.49 14.44 5.35 13.71 4.34L12 2Z"></path></svg>
              <h2 className="text-xl font-black tracking-tight text-zinc-950">Trending Results</h2>
            </div>

            <div className="space-y-4">
              {datasets.slice(0, 5).map((ds, i) => (
                <Link href={`/search?category=${ds.domainType}`} key={ds.id} className="flex items-center gap-5 p-4 bg-white border border-zinc-200/80 rounded-2xl hover:border-orange-300 hover:shadow-md transition-all group">
                  <span className="text-2xl font-black text-zinc-300 group-hover:text-orange-400 w-8 text-center transition-colors">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-zinc-950 text-sm truncate mb-1">{ds.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                      <span className="text-orange-500">{ds.domainType || 'Dataset'}</span>
                      <span>•</span>
                      <span>Trending</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                </Link>
              ))}
              {datasets.length === 0 && <div className="text-zinc-400 text-sm font-semibold p-4">No trending datasets found.</div>}
            </div>
          </section>

          {/* Recent Publications */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-500" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <h2 className="text-xl font-black tracking-tight text-zinc-950">Recent Publications</h2>
            </div>

            <div className="space-y-6">
              {datasets.slice(0, 4).map((ds, i) => (
                <div key={ds.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full border-2 border-white bg-purple-500 shadow-sm"></div>
                    {i !== 3 && <div className="w-0.5 h-12 bg-zinc-200 mt-1"></div>}
                  </div>
                  <div className="-mt-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-zinc-400 uppercase">{ds.domainType || 'GENERAL'}</span>
                      <span className="text-[10px] font-bold text-zinc-400">Recently</span>
                    </div>
                    <h3 className="font-bold text-zinc-950 text-sm line-clamp-1 hover:text-purple-600 cursor-pointer transition-colors">
                      {ds.name}
                    </h3>
                  </div>
                </div>
              ))}
              {datasets.length === 0 && <div className="text-zinc-400 text-sm font-semibold p-4">No recent datasets found.</div>}
            </div>
          </section>

        </div>

        {/* Quick Access */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber-500" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <h2 className="text-xl font-black tracking-tight text-zinc-950">Quick Access</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'Exam Results', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
              { title: 'Recruitment', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { title: 'Sports Scores', icon: Trophy, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Election Live', icon: Vote, color: 'text-pink-600', bg: 'bg-pink-50' },
              { title: 'Court Orders', icon: Scale, color: 'text-zinc-600', bg: 'bg-zinc-100' },
              { title: 'Market Reports', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' }
            ].map(link => {
              const Icon = link.icon;
              return (
                <Link href="/explore" key={link.title} className="bg-white border border-zinc-200/80 rounded-xl p-4 flex items-center gap-3 hover:shadow-md hover:border-zinc-300 transition-all group">
                  <div className={`p-2 rounded-lg ${link.bg}`}>
                    <Icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                  <span className="text-sm font-bold text-zinc-800">{link.title}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <CreateResultModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        accessType={createAccessType}
      />
    </div>
  );
}
