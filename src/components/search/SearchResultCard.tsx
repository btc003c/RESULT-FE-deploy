import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Database, 
  FileText, 
  User, 
  MessageSquare,
  CheckCircle2,
  Users,
  Pin
} from 'lucide-react';

export interface SearchResult {
  type: 'user' | 'post' | 'workspace' | 'dataset' | 'record';
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  verified?: boolean;
  avatar?: string;
  followers?: number;
  datasetCount?: number;
  recordCount?: number;
  workspaceId?: string;
  datasetId?: string;
}

interface SearchResultCardProps {
  result: SearchResult;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  // Format numbers nicely
  const fmt = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const getHref = () => {
    switch(result.type) {
      case 'user': return `/profile/${result.id}`;
      case 'workspace': return `/organization/${result.workspaceId || result.id}`;
      case 'dataset': return `/dataset/${result.datasetId || result.id}`;
      default: return '#';
    }
  };

  // Render Social User Card
  if (result.type === 'user') {
    return (
      <Link href={getHref()} className="block group">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 hover:shadow-md transition-all flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
              {result.avatar ? (
                <img src={result.avatar} alt={result.title} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-zinc-900 truncate group-hover:text-purple-600 transition-colors flex items-center gap-2">
                {result.title}
                {result.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
              </h3>
              <p className="text-sm font-medium text-zinc-500 truncate">@{result.subtitle}</p>
              <div className="flex items-center gap-3 mt-1 text-xs font-bold text-zinc-400">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {fmt(result.followers)} Followers</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-600 uppercase tracking-widest">Social</span>
              </div>
            </div>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); /* Follow logic */ }}
            className="hidden sm:block shrink-0 px-5 py-2 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Follow
          </button>
        </div>
      </Link>
    );
  }

  // Render Post Card
  if (result.type === 'post') {
    return (
      <Link href={getHref()} className="block group">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 hover:shadow-md transition-all flex gap-4">
           <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
             <MessageSquare className="w-5 h-5 text-zinc-400" />
           </div>
           <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 mb-1">
               <span className="font-bold text-zinc-900">{result.title}</span>
               <span className="text-xs font-semibold text-zinc-400">@{result.subtitle}</span>
             </div>
             <p className="text-sm text-zinc-600 line-clamp-2 mb-2">{result.description}</p>
             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-500 uppercase tracking-widest">Post</span>
           </div>
        </div>
      </Link>
    );
  }

  // Render Organization Card
  if (result.type === 'workspace') {
    return (
      <Link href={getHref()} className="block group">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 justify-between sm:items-center">
          <div className="flex gap-5 items-start sm:items-center min-w-0">
            <div className="w-16 h-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-zinc-900 truncate group-hover:text-indigo-600 transition-colors flex items-center gap-2 mb-1">
                {result.title}
                {result.verified && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </h3>
              <p className="text-sm font-semibold text-zinc-500 truncate mb-2">{result.description}</p>
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-600 uppercase tracking-widest">Organization</span>
                <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> {fmt(result.datasetCount)} Datasets</span>
              </div>
            </div>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); }}
            className="hidden sm:block shrink-0 px-6 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Explore
          </button>
        </div>
      </Link>
    );
  }

  // Render Dataset Card
  if (result.type === 'dataset') {
    return (
      <Link href={getHref()} className="block group">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 justify-between sm:items-center">
          <div className="flex gap-4 items-start min-w-0">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-1">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-zinc-900 truncate group-hover:text-emerald-600 transition-colors">
                  {result.title}
                </h3>
              </div>
              <p className="text-xs font-bold text-zinc-400 mb-2">Published by <span className="text-zinc-600">{result.subtitle}</span></p>
              <p className="text-sm text-zinc-600 line-clamp-2 mb-3">{result.description}</p>
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 uppercase tracking-widest">Dataset</span>
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {fmt(result.recordCount)} Records</span>
              </div>
            </div>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); }}
            className="hidden sm:flex items-center gap-2 shrink-0 px-4 py-2 bg-zinc-50 text-zinc-600 border border-zinc-200 text-sm font-bold rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <Pin className="w-4 h-4" /> Pin
          </button>
        </div>
      </Link>
    );
  }

  // Fallback / Record
  return (
    <Link href={getHref()} className="block group">
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 hover:shadow-md transition-all flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-md font-bold text-zinc-900 truncate group-hover:text-[#FFC82A]">{result.title}</h3>
          <p className="text-xs font-semibold text-zinc-500 truncate">{result.subtitle}</p>
        </div>
        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-600 uppercase tracking-wider shrink-0 hidden sm:block">
          RECORD
        </span>
      </div>
    </Link>
  );
}
