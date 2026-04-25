"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const inputRefs = useRef([]);
  const router = useRouter();

  // Countdown timer for OTP
  useEffect(() => {
    if (step !== 2) return;
    const interval = setInterval(() => {
      setTimer(t => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = s =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── STEP 1: Send OTP ──────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);

    try {
      const res = await fetch(`${API}/auth/forgot-password?email=${email}`,
        { method: "POST" });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setStep(2);      
        setTimer(300);
      } else {
        setError(data.message || "Email not found");
      }
    } catch (err) {
      setLoading(false);
      setError("Server connection failed");
    }
  };

  // ── STEP 2: Verify OTP ────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputRefs.current[i - 1]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return setError("Enter all 6 digits");
    setError(""); setLoading(true);

    try {
      const res = await fetch(
        `${API}/auth/verify-otp?email=${email}&otp=${code}`,
        { method: "POST" }
      );
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setStep(3);
      } else {
        setError(data.message || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setLoading(false);
      setError("Verification failed");
    }
  };

  // ── STEP 3: Reset Password ────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");
    if (newPassword.length < 8)
      return setError("Password must be at least 8 characters");

    setError(""); setLoading(true);

    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join(""), newPassword }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        router.push("/login?reset=success");
      } else {
        setError(data.message || "Reset failed");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans text-slate-800 selection:bg-emerald-100">
      
      {/* ==================== LEFT COLUMN (BRANDING) ==================== */}
      <div className="flex w-full lg:w-[50%] xl:w-[60%] min-h-[35vh] lg:h-auto bg-[#F7F8FA] flex-col relative overflow-hidden bg-cover bg-center shrink-0" style={{ backgroundImage: "url('/image/rua-bg.jpg')" }}>
        <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply z-0"></div>
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 flex flex-col items-center lg:items-start justify-center h-full w-full p-8 lg:p-12 text-center lg:text-left pt-8 lg:pt-32">
           <div className="w-20 h-20 lg:w-28 lg:h-28 lg:absolute lg:top-8 lg:left-8 bg-[#FFFFFF]/10 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center p-3 border border-[#FFFFFF]/20 mb-4 lg:mb-0">
               <img src="/image/rua-logo.png" alt="RUA Logo" className="w-full h-full object-contain" />
           </div>
           <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#FFFFFF] mb-2 tracking-tight drop-shadow-lg leading-tight lg:leading-tight">
               Royal University of Agriculture
           </h1>
           <p className="text-emerald-50 text-sm sm:text-base lg:text-xl max-w-[500px] drop-shadow-md lg:mt-4">
               Secure Access Recovery — Recover your account safely and quickly.
           </p>
        </div>
      </div>

      {/* ==================== RIGHT COLUMN (FORM) ==================== */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 lg:p-24 relative overflow-y-auto bg-white rounded-t-3xl lg:rounded-none -mt-6 lg:mt-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] lg:shadow-none">
        <div className="w-full mt-auto mb-auto max-w-[380px] fade-up">
           
           {/* Header Dynamic Based on Step */}
           <h2 className="text-3xl font-bold text-slate-900 mb-2">
             {step === 1 && "Forgot Password"}
             {step === 2 && "OTP Verification"}
             {step === 3 && "Set New Password"}
           </h2>
           <p className="text-slate-500 text-[15px] mb-6">
             {step === 1 && "Enter your registered email address to receive a code."}
             {step === 2 && <>Enter the 6-digit code sent to <span className="font-bold text-emerald-600">{email}</span></>}
             {step === 3 && "Create a strong new password for your account."}
           </p>

           {error && (
             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
               <span>❌</span> {error}
             </div>
           )}

           {/* ── Step 1 Form ── */}
           {step === 1 && (
             <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                   </div>
                   <input 
                      type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-[15px] font-medium transition-all outline-none text-slate-800" 
                   />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] active:scale-[0.98] flex items-center justify-center gap-2">
                   {loading ? <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"/> : "Send OTP"}
                </button>
                <div className="text-center pt-4">
                   <Link href="/login" className="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors">Back to Login</Link>
                </div>
             </form>
           )}

           {/* ── Step 2 Form ── */}
           {step === 2 && (
             <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex gap-2 justify-between">
                   {otp.map((digit, i) => (
                     <input
                       key={i}
                       ref={el => inputRefs.current[i] = el}
                       type="text" maxLength={1} value={digit}
                       onChange={e => handleOtpChange(i, e.target.value)}
                       onKeyDown={e => handleKeyDown(i, e)}
                       className="w-12 h-14 text-center text-xl font-bold border border-gray-100 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 bg-gray-50 transition-all font-mono"
                     />
                   ))}
                </div>
                
                <div className="flex flex-col items-center gap-1">
                   <p className={`text-sm font-mono font-bold tracking-wider ${timer < 60 ? "text-red-500 animate-pulse" : "text-slate-400"}`}>
                      {timer > 0 ? `⏱ ${formatTime(timer)}` : "⚠️ Code Expired"}
                   </p>
                </div>

                <button type="submit" disabled={loading || timer === 0} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                   {loading ? <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"/> : "Verify Code"}
                </button>

                <div className="text-center">
                   <button type="button" onClick={() => { setStep(1); setOtp(["","","","","",""]); setError(""); }} className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors underline underline-offset-4">Resend OTP</button>
                </div>
             </form>
           )}

           {/* ── Step 3 Form ── */}
           {step === 3 && (
             <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                   </div>
                   <input 
                      type={showPassword ? "text" : "password"} required value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="New password (min 8 chars)"
                      className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-[15px] font-medium transition-all outline-none text-slate-800" 
                   />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                      {showPassword ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                   </button>
                </div>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                   </div>
                   <input 
                      type={showConfirmPassword ? "text" : "password"} required value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-[15px] font-medium transition-all outline-none text-slate-800" 
                   />
                   <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                      {showConfirmPassword ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                   </button>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] active:scale-[0.98] flex items-center justify-center gap-2">
                   {loading ? <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"/> : "Reset Password"}
                </button>
             </form>
           )}

        </div>
        
        {/* Copyright */}
        <div className="absolute bottom-6 w-full text-center text-[11px] font-bold text-slate-300 uppercase tracking-widest hidden sm:block">
           © 2026 ALL RIGHTS RESERVED
        </div>

      </div>
    </div>
  );
}
