import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader2, AlertCircle, Shield, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');
    const [loginRole, setLoginRole] = useState('GUEST'); 

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setAuthError('');
        const res = await login(data.email, data.password);
        if (res.success) {
            const storedUser = JSON.parse(localStorage.getItem('kuriftu_user'));
            if (storedUser.role === 'GUEST') {
                navigate('/experience');
            } else {
                navigate('/admin/dashboard');
            }
        } else {
            setAuthError(res.error);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-500">
            {/* Background Decorators */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] dark:border-white/5 p-12 rounded-[56px] shadow-2xl relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center bg-gradient-to-br from-[#C5A059] to-[#D4AF37] w-14 h-14 rounded-[22px] shadow-lg shadow-amber-500/20 mb-6">
                        <LogIn className="text-white" size={28} />
                    </div>
                    <h1 className="text-4xl font-serif font-black tracking-tight mb-2">Member Login</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Access the Kuriftu Intelligence Ecosystem</p>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {authError && (
                            <div className="bg-rose-500/5 border border-rose-500/20 text-rose-500 p-5 rounded-2xl mb-8 flex items-center gap-3 text-sm font-semibold">
                                <AlertCircle size={18} />
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block px-1">Email Address</label>
                                <input
                                    {...register('email')}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] dark:border-white/5 rounded-2xl px-6 py-5 text-[var(--foreground)] font-medium focus:outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-slate-700/30"
                                    placeholder="Enter your email"
                                />
                                {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block px-1">Password</label>
                                <input
                                    {...register('password')}
                                    type="password"
                                    className="w-full bg-[var(--background)] border border-[var(--border)] dark:border-white/5 rounded-2xl px-6 py-5 text-[var(--foreground)] font-medium focus:outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-slate-700/30"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.password.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-gold w-full flex items-center justify-center gap-3 mt-4 text-[10px] uppercase tracking-widest"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Sign In to Kuriftu"}
                            </button>
                        </form>
                    </motion.div>
                </AnimatePresence>

                <div className="text-center mt-12 space-y-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Don't have an account? 
                        <Link to="/signup" className="text-[#C5A059] ml-2 hover:underline">Create Guest Account</Link>
                    </p>
                    <Link to="/" className="block text-[10px] font-black text-slate-400 hover:text-[#C5A059] uppercase tracking-[0.2em] transition-colors pt-4">← Back to World-Class Landing</Link>
                </div>
            </motion.div>
        </div>
    );
}
