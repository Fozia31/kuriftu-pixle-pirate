import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setAuthError('');
        const res = await login(data.email, data.password);
        if (res.success) {
            navigate('/');
        } else {
            setAuthError(res.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#060913] flex items-center justify-center p-6 relative overflow-hidden font-['Outfit',sans-serif]">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full bg-[#12192B]/80 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-2xl shadow-lg shadow-indigo-500/30 mb-6">
                        <LogIn className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 mt-2 font-medium">Access your T-ARO Command Center</p>
                </div>

                {authError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-semibold animate-shake">
                        <AlertCircle size={18} />
                        {authError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-2 px-1">Email Address</label>
                        <input
                            {...register('email')}
                            className="w-full bg-[#0A0E1A] border border-white/5 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                            placeholder="manager@kurifturesort.com"
                        />
                        {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-2 px-1">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full bg-[#0A0E1A] border border-white/5 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-4 rounded-2xl shadow-lg border border-indigo-400/30 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Enter Command Center'}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 text-sm font-medium">
                    Don't have access? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors">Request Account</Link>
                </p>
            </div>
        </div>
    );
}
