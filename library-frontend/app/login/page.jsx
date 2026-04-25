'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { login, register } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const res = await login({ username: form.username, password: form.password });
        const { token, ...user } = res.data;
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('user', JSON.stringify(user), { expires: 1 });
        toast.success(`Welcome back, ${user.fullName}!`);
        router.push('/dashboard');
      } else {
        const res = await register(form);
        const { token, ...user } = res.data;
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('user', JSON.stringify(user), { expires: 1 });
        toast.success(`Welcome to RUA Finance, ${user.fullName}!`);
        router.push('/dashboard');
      }
    } catch (err) {
      let msg = 'An unexpected error occurred';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') msg = err.response.data;
        else if (err.response.data.message) msg = err.response.data.message;
        else if (err.response.data.error) msg = err.response.data.error;
        else msg = JSON.stringify(err.response.data);
      } else {
        msg = isLogin ? 'Invalid username or password' : 'Registration failed';
      }
      if (typeof msg !== 'string') msg = JSON.stringify(msg);
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.error(`${provider} login is not integrated yet. Please use standard login.`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans text-slate-800 selection:bg-emerald-100">
      
      {/* ==================== LEFT COLUMN (BRANDING & VISUALS) ==================== */}
      <div className="flex w-full lg:w-[50%] xl:w-[60%] min-h-[35vh] sm:min-h-[40vh] lg:h-auto bg-[#F7F8FA] flex-col relative overflow-hidden bg-cover bg-center shrink-0" style={{ backgroundImage: "url('/image/rua-bg.jpg')" }}>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply z-0"></div>
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center lg:items-start justify-center h-full w-full p-8 lg:p-12 text-center lg:text-left pt-8 lg:pt-32">
           {/* Logo */}
           <div className="w-20 h-20 lg:w-28 lg:h-28 lg:absolute lg:top-8 lg:left-8 bg-[#FFFFFF]/10 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center p-3 border border-[#FFFFFF]/20 mb-4 lg:mb-0">
               <img src="/image/rua-logo.png" alt="RUA Logo" className="w-full h-full object-contain drop-shadow-md" />
           </div>

           {/* Typography */}
           <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#FFFFFF] mb-2 lg:mb-4 tracking-tight drop-shadow-lg leading-tight lg:leading-tight">
               Royal University of Agriculture
           </h1>
           <p className="text-emerald-50 text-sm sm:text-base lg:text-xl max-w-[500px] drop-shadow-md lg:mt-4">
               A center of excellence in agricultural education, research, and innovation.
           </p>
        </div>
      </div>

      {/* ==================== RIGHT COLUMN (FORM) ==================== */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 lg:p-24 relative overflow-y-auto bg-white rounded-t-3xl lg:rounded-none -mt-6 lg:mt-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] lg:shadow-none">
        <div className="w-full mt-auto mb-auto max-w-[380px] fade-up">
           
           {/* Header */}
           <h2 className="text-3xl font-bold text-slate-900 mb-2">
             {isLogin ? 'Welcome back!' : 'Create account'}
           </h2>
           <p className="text-slate-500 text-[15px] mb-6">
             Access your university library account
           </p>

           {resetSuccess && (
             <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
               ✅ Password reset successfully! Please login with your new password.
             </div>
           )}

           {error && (
             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm mt-0">
               ❌ {error}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-4">
              
               {!isLogin && (
                  <>
                    {/* Full Name */}
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                       </div>
                       <input 
                          type="text" 
                          placeholder="Full Name" 
                          value={form.fullName} 
                          onChange={e => setForm({...form, fullName: e.target.value})} 
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-[15px] font-medium transition-all outline-none text-slate-800 placeholder-slate-400" 
                          required 
                       />
                    </div>

                    {/* Phone or Email (Signup only) */}
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                       </div>
                       <input 
                          type="text" 
                          placeholder="Phone number or Email" 
                          value={form.email} 
                          onChange={e => setForm({...form, email: e.target.value})} 
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-[15px] font-medium transition-all outline-none text-slate-800 placeholder-slate-400" 
                          required 
                       />
                    </div>
                  </>
               )}
               
               {/* Username Main Field */}
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <input 
                     type="text" 
                     placeholder={isLogin ? "you@example.com (or Username)" : "Username"} 
                     value={form.username} 
                     onChange={e => setForm({...form, username: e.target.value})} 
                     className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-[15px] font-medium transition-all outline-none text-slate-800 placeholder-slate-400" 
                     required 
                  />
               </div>
               
               {/* Password */}
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input 
                     type="password" 
                     placeholder="At least 8 characters" 
                     value={form.password} 
                     onChange={e => setForm({...form, password: e.target.value})} 
                     className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-[15px] font-medium transition-all outline-none text-slate-800 placeholder-slate-400" 
                     required 
                  />
                  {/* Eye icon */}
                  <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
               </div>
            
               {isLogin && (
                 <div className="flex justify-end pt-1 pb-4">
                    <Link href="/forgot-password" className="text-[13.5px] font-bold text-emerald-500 hover:text-emerald-600 transition-colors">Forgot password?</Link>
                 </div>
               )}
               {!isLogin && <div className="pb-3" />}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                 {loading ? <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"/> : (
                    isLogin ? 'Login' : 'Sign Up'
                 )}
              </button>
           </form>

           {/* Divider */}
               <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-gray-100"></div>
                  <span className="text-[13px] font-medium text-slate-400 uppercase tracking-wide">or</span>
                  <div className="flex-1 h-px bg-gray-100"></div>
               </div>

               {/* Social Buttons */}
               <div className="grid grid-cols-2 gap-4">
                   <button type="button" onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-[14px] text-slate-700 shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                         <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                         <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                         <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                   </button>
                   <button type="button" onClick={() => handleSocialLogin('Facebook')} className="flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-[14px] text-slate-700 shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                      </svg>
                      Facebook
                   </button>
               </div>

           {/* Toggle Text */}
           <div className="mt-12 text-center pb-8">
             <p className="text-[14px] text-slate-500 font-medium tracking-wide">
               {isLogin ? "Don't you have an account? " : "Already have an account? "}
               <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-emerald-500 hover:text-emerald-600 transition-colors">
                  {isLogin ? "Sign Up" : "Login"}
               </button>
             </p>
           </div>
        </div>
        
        {/* Copyright */}
        <div className="absolute bottom-6 w-full text-center text-[11px] font-bold text-slate-300 uppercase tracking-widest hidden sm:block">
           © 2026 ALL RIGHTS RESERVED
        </div>

      </div>
    </div>
  );
}