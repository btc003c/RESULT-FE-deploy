"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken } from "@/lib/api";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<React.ReactNode>("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rh_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.auth.login({ email, password });

      if (rememberMe) {
        localStorage.setItem('rh_remembered_email', email);
      } else {
        localStorage.removeItem('rh_remembered_email');
      }

      if (response.accessToken) {
        setAuthToken(response.accessToken, response.refreshToken);

        if (typeof window !== 'undefined') {
          localStorage.setItem('rh_user', JSON.stringify({
            id: response.user?.id,
            email: response.user?.email,
            name: response.user?.name,
            role: response.user?.role,
            requiresMfa: response.requiresMfa
          }));
        }

        if (response.requiresMfa) {
          router.push('/login/mfa');
          return;
        }

        // Role-based routing — redirect to the correct portal
        const role = response.user?.role;
        if (role === 'ADMIN') {
          router.push('/superadmin');
        } else if (role === 'ORGANIZATION') {
          // Org accounts — send them to the org dashboard
          const sessionId = crypto.randomUUID();
          localStorage.setItem('rh_session_id', sessionId);
          router.push(`/dashboard/${sessionId}`);
        } else {
          // Standard USER
          router.push('/');
        }
      } else {
        setError("Invalid response from server. Missing token.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="flex min-h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* ══════════════════════════════════════
          LEFT PANEL - BRANDING (Hidden on Mobile)
          ══════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-zinc-950 flex-col justify-between p-12 overflow-hidden border-r border-zinc-800">
        {/* Abstract Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/billionword-bg.png" 
            alt="Billionword Network" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-[2000ms] hover:scale-105"
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-zinc-950 z-10" />
        </div>

        {/* Brand Header */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a896] to-[#FFC82A] flex items-center justify-center shadow-lg">
             <span className="text-zinc-950 font-black text-xl">B</span>
          </div>
          <span className="text-xl font-black text-white tracking-widest">BillionWord</span>
        </div>

        {/* Brand Hero Text */}
        <div className="relative z-20 max-w-lg mb-10">
          <h1 className="text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            The ecosystem for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC82A] to-[#00a896]">future</span> of interaction.
          </h1>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed">
            Connect with millions of users, engage with top publishers, and experience the world's most powerful social ecosystem.
          </p>
          
          {/* Decorative stats/badges */}
          <div className="flex items-center gap-6 mt-10">
             <div className="flex flex-col">
               <span className="text-2xl font-black text-white">100M+</span>
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Users</span>
             </div>
             <div className="w-px h-10 bg-zinc-800"></div>
             <div className="flex flex-col">
               <span className="text-2xl font-black text-white">99.9%</span>
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Uptime</span>
             </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL - AUTHENTICATION FLOW
          ══════════════════════════════════════ */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16 relative z-10 bg-background overflow-y-auto">
        <div className="w-full max-w-sm">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a896] to-[#FFC82A] flex items-center justify-center shadow-lg">
               <span className="text-zinc-950 font-black text-xl">B</span>
            </div>
            <span className="text-xl font-black text-zinc-900 tracking-widest">BillionWord</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight mb-2 text-zinc-900">Welcome back</h2>
            <p className="text-sm text-zinc-500 font-semibold">Sign in to your account to continue.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border-l-4 border-red-500 mb-6 flex items-start gap-3 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div className="space-y-1.5 group">
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-[#00a896] transition-colors" htmlFor="email">Email address</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border-2 border-zinc-100 bg-zinc-50/50 outline-none focus:border-[#00a896] focus:bg-white transition-all text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 shadow-sm" 
                placeholder="name@organization.edu" 
              />
            </div>
            
            <div className="space-y-1.5 group relative">
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-[#00a896] transition-colors" htmlFor="password">Password</label>
              <div className="relative">
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-zinc-100 bg-zinc-50/50 outline-none focus:border-[#00a896] focus:bg-white transition-all text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 shadow-sm pr-12" 
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2.5} /> : <Eye className="w-4 h-4" strokeWidth={2.5} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 pt-2">
              <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-500 cursor-pointer select-none hover:text-zinc-900 transition-colors">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-4 h-4 border-2 border-zinc-300 rounded cursor-pointer checked:border-[#00a896] checked:bg-[#00a896] transition-all" 
                  />
                  <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                Remember me
              </label>
              <Link href="/forgot-password" className="text-xs font-black text-[#00a896] hover:underline hover:text-[#008f7f] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="relative w-full mt-8 py-3.5 rounded-xl bg-zinc-900 text-white font-black text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-zinc-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden group"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </div>
            </button>
          </form>

          {/* OAuth Separator */}
          <div className="mt-10 mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-100"></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Or continue with</span>
            <div className="h-px flex-1 bg-zinc-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-zinc-100 rounded-xl hover:border-zinc-300 hover:bg-zinc-50 transition-colors text-xs font-bold text-zinc-700 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-zinc-100 rounded-xl hover:border-zinc-300 hover:bg-zinc-50 transition-colors text-xs font-bold text-zinc-700 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          <p className="mt-10 text-center text-xs font-semibold text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-black text-zinc-900 hover:text-[#00a896] hover:underline transition-colors">
              Sign up free
            </Link>
          </p>

          {/* Portal Switcher */}
          <div className="mt-10 pt-6 border-t-2 border-zinc-50 space-y-3">
            <p className="text-[10px] text-center text-zinc-400 font-black uppercase tracking-widest mb-4">Other Portals</p>
            
            <Link
              href="/organization/login"
              className="flex items-center justify-between w-full px-5 py-4 rounded-2xl border-2 border-zinc-100 bg-white hover:border-[#FFC82A] hover:shadow-md transition-all group shrink-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900">Organization Portal</p>
                  <p className="text-xs font-semibold text-zinc-400">For institutions &amp; publishers</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:border-[#FFC82A] group-hover:text-[#FFC82A] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </Link>
            
            <Link
              href="/superadmin"
              className="flex items-center justify-between w-full px-5 py-4 rounded-2xl border-2 border-zinc-100 bg-white hover:border-red-400 hover:shadow-md transition-all group shrink-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900">Admin Panel</p>
                  <p className="text-xs font-semibold text-zinc-400">Super administrators only</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:border-red-400 group-hover:text-red-500 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
