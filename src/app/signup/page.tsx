"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";

type Step = "DETAILS" | "OTP";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("DETAILS");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await api.auth.register({ name, email, password });
      setStep("OTP");
      setSuccess("Account pre-registered! An OTP has been sent to your email.");
      setResendTimer(120);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await api.auth.verifyOtp({ email, otp });
      setSuccess("Account fully verified! Redirecting to login...");
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await api.auth.register({ name, email, password }); // Resend logic
      setSuccess("A new OTP has been sent to your email address.");
      setResendTimer(120);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
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
        {/* Abstract Background Image (Reusing the same premium background) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/billionword-bg.png" 
            alt="Billionword Network" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-[2000ms] hover:scale-105"
          />
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
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC82A] to-[#00a896]">future</span> of interaction.
          </h1>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed">
            Create your account today. Connect with millions of users, engage with top publishers, and experience the world's most powerful social ecosystem.
          </p>
          
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
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a896] to-[#FFC82A] flex items-center justify-center shadow-lg">
               <span className="text-zinc-950 font-black text-xl">B</span>
            </div>
            <span className="text-xl font-black text-zinc-900 tracking-widest">BillionWord</span>
          </div>

          {step === "OTP" && (
            <button 
              onClick={() => setStep("DETAILS")}
              className="inline-flex items-center text-xs font-bold tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors mb-8 uppercase group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
              Back
            </button>
          )}

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight mb-2 text-zinc-900">
              {step === "DETAILS" ? "Create an account" : "Verify Email"}
            </h2>
            <p className="text-sm text-zinc-500 font-semibold">
              {step === "DETAILS" ? "Join the public data ecosystem today." : "Enter the 6-digit verification code sent to your email."}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border-l-4 border-red-500 mb-6 flex items-start gap-3 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border-l-4 border-emerald-500 mb-6 flex items-start gap-3 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mt-0.5 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {success}
            </div>
          )}

          {step === "DETAILS" && (
            <form className="space-y-5" onSubmit={handleSignup}>
              
              <div className="space-y-1.5 group">
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-[#00a896] transition-colors" htmlFor="name">Full Name</label>
                <input 
                  id="name" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-zinc-100 bg-zinc-50/50 outline-none focus:border-[#00a896] focus:bg-white transition-all text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 shadow-sm" 
                  placeholder="John Doe"
                />
              </div>
              
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

              <div className="space-y-1.5 group">
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-[#00a896] transition-colors" htmlFor="password">Password</label>
                <input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-zinc-100 bg-zinc-50/50 outline-none focus:border-[#00a896] focus:bg-white transition-all text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 shadow-sm" 
                  placeholder="••••••••" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="relative w-full mt-8 py-3.5 rounded-xl bg-[#00a896] text-white font-black text-sm shadow-[0_8px_30px_rgba(0,168,150,0.25)] hover:bg-[#008f7f] hover:shadow-[0_8px_30px_rgba(0,168,150,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden group"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                <div className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </div>
              </button>

              <div className="mt-8 pt-6 border-t-2 border-zinc-50 text-center">
                 <p className="text-xs font-semibold text-zinc-500">
                   Already have an account?{' '}
                   <Link href="/login" className="font-black text-zinc-900 hover:text-[#00a896] hover:underline transition-colors">
                     Sign in
                   </Link>
                 </p>
              </div>
            </form>
          )}

          {step === "OTP" && (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div className="space-y-1.5 group">
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-[#00a896] transition-colors text-center lg:text-left" htmlFor="otp">6-Digit Code</label>
                <input 
                  id="otp" 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-4 rounded-xl border-2 border-zinc-100 bg-zinc-50/50 outline-none focus:border-[#00a896] focus:bg-white transition-all text-2xl font-black text-zinc-900 tracking-[0.5em] text-center shadow-sm" 
                  placeholder="------" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || otp.length !== 6}
                className="relative w-full mt-8 py-3.5 rounded-xl bg-zinc-900 text-white font-black text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-zinc-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden group"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                <div className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    'Verify Registration'
                  )}
                </div>
              </button>

              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isLoading}
                  className="text-xs font-black text-[#00a896] hover:underline hover:text-[#008f7f] transition-colors disabled:text-zinc-400 disabled:no-underline disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {step === "DETAILS" && (
            <p className="mt-8 text-center text-[10px] font-bold text-zinc-400 px-4 leading-relaxed uppercase tracking-widest">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-zinc-600 hover:text-zinc-900 hover:underline">Terms</Link> and{' '}
              <Link href="/privacy" className="text-zinc-600 hover:text-zinc-900 hover:underline">Privacy Policy</Link>.
            </p>
          )}

        </div>
      </div>
    </main>
  );
}
