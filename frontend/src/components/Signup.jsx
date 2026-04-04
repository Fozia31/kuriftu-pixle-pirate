import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, AlertCircle, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const PREFERENCES = [
    { id: 'spa', label: 'Spa & Wellness', icon: '💆‍♂️' },
    { id: 'water', label: 'Water Sports', icon: '🚣' },
    { id: 'dining', label: 'Fine Dining', icon: '🍷' },
    { id: 'culture', label: 'Cultural Tours', icon: '🏛️' },
    { id: 'yoga', label: 'Yoga & Meditation', icon: '🧘' },
    { id: 'nature', label: 'Nature & Hikes', icon: '🌿' }
];

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');
    const [selectedPrefs, setSelectedPrefs] = useState([]);
    const [step, setStep] = useState(1); // 1: Info, 2: Preferences

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema)
    });

    const togglePreference = (id) => {
        setSelectedPrefs(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const onSubmit = async (data) => {
        if (step === 1) {
            setStep(2);
            return;
        }

        setAuthError('');
        const { confirmPassword, ...signupData } = data;
        const res = await signup(signupData.name, signupData.email, signupData.password, 'GUEST', selectedPrefs);
        
        if (res.success) {
            navigate('/experience');
        } else {
            setAuthError(res.error);
            setStep(1); 
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-500">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/5 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] dark:border-white/5 p-12 rounded-[56px] shadow-2xl relative z-10"
            >
                <div className="text-center mb-12">
                    <img src="/logo-transparent.png" alt="Kuriftu Logo" className="w-16 h-16 object-contain mx-auto mb-6" />
                    <h1 className="text-4xl font-serif font-black tracking-tight leading-tight mb-2">Join the Club</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Personalize your luxury escape</p>
                </div>

                {authError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-5 rounded-2xl mb-8 flex items-center gap-3 text-sm font-semibold">
                        <AlertCircle size={18} />
                        {authError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Full Name</label>
                                    <input
                                        {...register('name')}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] dark:border-white/5 rounded-2xl px-6 py-5 text-[var(--foreground)] font-medium focus:outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-slate-700/30"
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Email Address</label>
                                    <input
                                        {...register('email')}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] dark:border-white/5 rounded-2xl px-6 py-5 text-[var(--foreground)] font-medium focus:outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-slate-700/30"
                                        placeholder="traveller@kuriftu.com"
                                    />
                                    {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Password</label>
                                    <input
                                        {...register('password')}
                                        type="password"
                                        className="w-full bg-[var(--background)] border border-[var(--border)] dark:border-white/5 rounded-2xl px-6 py-5 text-[var(--foreground)] font-medium focus:outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-slate-700/30"
                                        placeholder="••••••••"
                                    />
                                    {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.password.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Confirm Password</label>
                                    <input
                                        {...register('confirmPassword')}
                                        type="password"
                                        className="w-full bg-[var(--background)] border border-[var(--border)] dark:border-white/5 rounded-2xl px-6 py-5 text-[var(--foreground)] font-medium focus:outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-slate-700/30"
                                        placeholder="••••••••"
                                    />
                                    {errors.confirmPassword && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.confirmPassword.message}</p>}
                                </div>
                                <div className="space-y-2 text-center pt-4">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[#C5A059] mb-4">Step 01 of 02</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <p className="text-[10px] font-black text-slate-400 mb-8 text-center tracking-[0.2em] uppercase">What do you prefer in a retreat?</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {PREFERENCES.map((pref) => (
                                        <button
                                            key={pref.id}
                                            type="button"
                                            onClick={() => togglePreference(pref.id)}
                                            className={`p-6 rounded-[28px] border text-left transition-all duration-500 relative group ${selectedPrefs.includes(pref.id) ? 'bg-gradient-to-br from-[#C5A059] to-[#D4AF37] border-transparent text-white shadow-xl shadow-amber-500/10' : 'bg-[var(--background)] border-[var(--border)] dark:border-white/5 text-[var(--foreground)] hover:border-[#C5A059]/30'}`}
                                        >
                                            <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">{pref.icon}</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest block">{pref.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-6 flex gap-4">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-10 rounded-2xl border border-[var(--border)] dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[var(--foreground)] transition-all"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 btn-gold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (step === 1 ? 'Next Step' : 'Join Resident Club')}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-12">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Already registered? <Link to="/login" className="text-[#C5A059] hover:underline inline-block ml-2">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
