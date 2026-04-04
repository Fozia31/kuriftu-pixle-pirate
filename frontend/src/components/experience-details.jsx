import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Compass, Hotel, Palmtree, Sparkles, UtensilsCrossed, Wind } from 'lucide-react';
import { getExperienceById } from '../data/experiences';

const iconMap = {
    hotel: Hotel,
    wind: Wind,
    palmtree: Palmtree,
    utensils: UtensilsCrossed,
    compass: Compass
};

export default function ExperienceDetailPage() {
    const { id } = useParams();
    const experience = getExperienceById(id);

    if (!experience) {
        return <Navigate to="/experience" replace />;
    }

    const Icon = iconMap[experience.iconKey] || Compass;

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-500 pb-20 overflow-x-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                <Link
                    to="/experience"
                    className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A059] hover:text-[#D4AF37] transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back To Experiences
                </Link>

                <div className="mt-10 relative p-1 rounded-[48px] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] shadow-2xl shadow-amber-500/10">
                    <div className="bg-[var(--background)]/95 rounded-[46px] border border-white/5 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
                            <div className="relative min-h-[360px] lg:min-h-[640px]">
                                <img
                                    src={experience.image}
                                    alt={experience.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent"></div>
                                <div className="absolute top-8 left-8">
                                    <div className={`px-5 py-2.5 rounded-xl border font-black text-[9px] uppercase tracking-widest flex items-center gap-2 backdrop-blur-xl ${experience.special ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-100' : 'bg-stone-900/40 border-white/10 text-white'}`}>
                                        {experience.special && <Sparkles size={10} />}
                                        {experience.tag}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${experience.special ? 'bg-indigo-500/10 text-indigo-500' : 'bg-[#C5A059]/10 text-[#C5A059]'}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-2">
                                                {experience.subtitle}
                                            </p>
                                            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight">
                                                {experience.name}
                                            </h1>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-serif font-black leading-tight mb-6">
                                        {experience.detailTitle}
                                    </h2>
                                    <p className="text-base text-slate-500 font-medium leading-relaxed mb-10">
                                        {experience.detailBody}
                                    </p>

                                    <div className="grid gap-4">
                                        {experience.highlights.map((highlight) => (
                                            <div
                                                key={highlight}
                                                className="flex items-center gap-4 rounded-2xl border border-[var(--border)] dark:border-white/5 bg-[var(--card)] px-5 py-4"
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center">
                                                    <Compass size={16} />
                                                </div>
                                                <p className="text-sm font-semibold text-slate-500">{highlight}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                    <button className="bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all duration-500 shadow-xl active:scale-95">
                                        Reserve Experience
                                    </button>
                                    <Link
                                        to="/experience"
                                        className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-[var(--border)] dark:border-white/5 hover:border-[#C5A059]/40 hover:text-[#C5A059] transition-all text-center"
                                    >
                                        Explore More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
