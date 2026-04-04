import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-500">
            {/* Minimalist Sticky Navbar */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-[var(--border)] dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-[#C5A059] to-[#D4AF37] w-8 h-8 rounded-lg shadow-lg"></div>
                        <span className="text-xl font-serif font-black tracking-tighter uppercase">Kuriftu</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-10">
                        {['Experiences', 'Suites', 'Dining', 'Wellness'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#C5A059] transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <Link to="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[var(--foreground)] transition-colors">Sign In</Link>
                        <Link to="/signup" className="px-8 py-3 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95">
                            Join Club
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Visual Background */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop" 
                        alt="Luxury Resort" 
                        className="w-full h-full object-cover opacity-60 dark:opacity-40 transition-opacity duration-1000 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/20 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6">
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.5em] mb-6"
                    >
                        Excellence Redefined
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-9xl font-serif font-black tracking-tight leading-[0.95] mb-10"
                    >
                        Beyond the <br />
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#D4AF37]">Ordinary.</span>
                    </motion.h1>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-8"
                    >
                        <Link to="/signup" className="group flex items-center gap-4 bg-[var(--foreground)] text-[var(--background)] px-12 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all duration-500 shadow-2xl">
                            Explore Experiences
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </header>

            {/* Value Proposition Grid */}
            <section className="py-40 px-6 relative z-10 overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Predictive Service', icon: <ShieldCheck />, desc: 'Intelligence that anticipates your arrival, adjusting every detail to your comfort before you even ask.' },
                            { title: 'Hyper-Personalized', icon: <Zap />, desc: 'A retreat curated by AI, learning your preferences to ensure every stay is a unique masterpiece.' },
                            { title: 'Signature Luxury', icon: <Heart />, desc: 'Authentically Ethiopian, digitally optimized. We provide a stay that is both heritage and high-tech.' }
                        ].map((card, idx) => (
                            <motion.div 
                                key={card.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="p-12 rounded-[48px] bg-[var(--card)] border border-[var(--border)] dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5 group"
                            >
                                <div className="w-16 h-16 bg-[#C5A059]/10 rounded-[22px] flex items-center justify-center mb-10 transition-all duration-500 group-hover:bg-[#C5A059] group-hover:text-white">
                                    {React.cloneElement(card.icon, { size: 32, className: "text-[#C5A059] group-hover:text-white transition-colors" })}
                                </div>
                                <h3 className="text-2xl font-serif font-black mb-6">{card.title}</h3>
                                <p className="text-base text-slate-500 leading-relaxed font-medium">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 border-t border-[var(--border)] dark:border-white/5 bg-[var(--background)]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#C5A059] w-6 h-6 rounded-md"></div>
                        <span className="text-sm font-serif font-black tracking-tighter uppercase">Kuriftu</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] text-center">
                        Kuriftu Resorts & Spa © 2026 · The Future of Stillness
                    </p>
                    <div className="flex gap-8">
                        {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                            <a key={social} href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#C5A059] transition-colors">{social}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
