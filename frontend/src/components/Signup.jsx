import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['EXECUTIVE_ADMIN', 'ROOM_MANAGER', 'SPA_MANAGER'])
});

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: { role: 'ROOM_MANAGER' }
    });

    const onSubmit = async (data) => {
        setAuthError('');
        const res = await signup(data.name, data.email, data.password, data.role);
        if (res.success) {
            navigate('/');
        } else {
            setAuthError(res.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#060913] flex items-center justify-center p-6 relative overflow-hidden font-['Outfit',sans-serif]">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full bg-[#12192B]/80 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-gradient-to-br from-emerald-500 to-indigo-600 w-16 h-16 rounded-2xl shadow-lg shadow-emerald-500/30 mb-6">
                        <UserPlus className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-400 mt-2 font-medium">Join the T-ARO Optimization Network</p>
                </div>

                {authError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-semibold">
                        <AlertCircle size={18} />
                        {authError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-1 px-1">Full Name</label>
                        <input
                            {...register('name')}
                            className="w-full bg-[#0A0E1A] border border-white/5 rounded-2xl px-5 py-3.5 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-1 px-1">Email Address</label>
                        <input
                            {...register('email')}
                            className="w-full bg-[#0A0E1A] border border-white/5 rounded-2xl px-5 py-3.5 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                            placeholder="manager@kurifturesort.com"
                        />
                        {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-1 px-1">Department Role</label>
                        <select
                            {...register('role')}
                            className="w-full bg-[#0A0E1A] border border-white/5 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="EXECUTIVE_ADMIN">Executive Master (Admin)</option>
                            <option value="ROOM_MANAGER">Room Division Manager</option>
                            <option value="SPA_MANAGER">Spa & Wellness Head</option>
                        </select>
                        {errors.role && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.role.message}</p>}
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-1 px-1">Secure Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full bg-[#0A0E1A] border border-white/5 rounded-2xl px-5 py-3.5 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg border border-white/10 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Register for T-ARO'}
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-500 text-sm font-medium">
                    Already registered? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
