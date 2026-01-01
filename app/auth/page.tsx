'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, User, ArrowRight, Lock, Activity, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { login, signup } from './actions';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
        const action = isLogin ? login : signup;
        const result = await action(formData);

        if (result?.error) {
            toast.error(result.error);
            setLoading(false);
        } else {
            toast.success(isLogin ? 'Welcome back.' : 'Account created successfully.');
            // Redirect is handled by the server action usually, but if we return, we can do it here too?
            // Actually best practice with server actions is either redirect OR return.
            // I will modify server action to RETURN data, and let client redirect if needed?
            // Or server action redirects on success.
            // If server action redirects, `await action` might throw or return undefined if redirect happens?
            // NEXT.js: "If you call redirect in a Server Action, it acts like a thrown error."
            // So `try/catch` might catch the redirect as an error? No, NEXT handles it.
            // BUT if I want to show a Toast *before* redirect, it might be tricky if redirection is immediate.
            // PLAN: Server Action returns `error` string if failing. If success, it returns nothing/success field. Client does redirect.
            if (result?.success) {
                 router.push('/');
            }
        }
    } catch (err) {
        // If redirect happens, it might be caught here? 
        // Usually Next.js redirect throws a specific error that should NOT be caught as "Something went wrong".
        // Use `isRedirectError`? Or just simple return values.
        // Let's stick to Return Values for cleaner control.
        console.error(err);
        toast.error('An unexpected error occurred.');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-100 via-transparent to-transparent dark:from-zinc-900/20">
      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[2rem] flex items-center justify-center text-2xl font-bold shadow-2xl mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
            O
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 serif italic">
            oneself
          </h1>
          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-600 font-medium uppercase tracking-[0.3em]">
            Balance is yours alone.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden group">
          {/* Decorative background pulse */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-zinc-100 dark:bg-zinc-800/50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 serif">
                {isLogin ? 'Welcome back' : 'Begin your journey'}
              </h2>
              <p className="text-sm text-zinc-400 dark:text-zinc-600 mt-1">
                {isLogin ? 'Enter your details to continue.' : 'Create your secure account to sync everywhere.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2 group/input">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 px-1 tracking-widest group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-zinc-100 transition-colors">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-zinc-100 transition-colors" size={18} />
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 group/input">
                <label className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 px-1 tracking-widest group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-zinc-100 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-zinc-100 transition-colors" size={18} />
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="name@email.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all"
                  />
                </div>
              </div>

               <div className="space-y-2 group/input">
                <label className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 px-1 tracking-widest group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-zinc-100 transition-colors">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-zinc-100 transition-colors" size={18} />
                  <input
                    required
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-zinc-200 dark:shadow-black flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:scale-100"
              >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                type="button"
                className="text-xs font-bold text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-widest"
              >
                {isLogin ? "Don't have an account? Join" : "Already a member? Sign In"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-zinc-400 dark:text-zinc-600">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-4">Privacy Principle</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-zinc-300 dark:text-zinc-700" /> Secure Auth</span>
            <span className="flex items-center gap-1.5"><Activity size={12} className="text-zinc-300 dark:text-zinc-700" /> Encrypted Data</span>
            <span className="flex items-center gap-1.5"><ArrowRight size={12} className="text-zinc-300 dark:text-zinc-700" /> Private Cloud</span>
          </div>
        </div>
      </div>
    </div>
  );
}
