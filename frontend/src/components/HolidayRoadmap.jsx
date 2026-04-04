import React, { useState } from 'react';
import { useMonthGrid } from 'kenat-ui';
import Kenat, { HolidayTags } from 'kenat';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, MapPin, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Compute current Ethiopian month/year safely ONCE at module level
function getCurrentEthiopian() {
    try {
        const k = new Kenat(new Date());
        return k.getEthiopian();
    } catch {
        return { year: 2017, month: 7, day: 1 };
    }
}

const INIT_ETH = getCurrentEthiopian();

export default function HolidayRoadmap() {
    const { theme } = useTheme();

    const [options, setOptions] = useState({
        year: INIT_ETH.year,
        month: INIT_ETH.month,
        holidayFilter: [HolidayTags.PUBLIC, HolidayTags.RELIGIOUS, HolidayTags.CULTURAL],
    });

    const { grid, controls } = useMonthGrid(options);

    if (!grid) return null;

    const holidaysInMonth = grid.days
        .filter(day => day && day.holidays && day.holidays.length > 0)
        .map(day => ({
            day: day.ethiopian.day,
            date: `${grid.monthName} ${day.ethiopian.day}`,
            holidays: day.holidays
        }));

    return (
        <div className="bg-[var(--card)] p-10 rounded-[56px] border border-[var(--border)] dark:border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-700">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-[-10%] w-[30%] h-full bg-[#C5A059]/5 blur-[100px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-[#C5A059]/10 p-4 rounded-2xl border border-[#C5A059]/20 shadow-sm">
                        <Calendar size={24} className="text-[#C5A059]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-black tracking-tight leading-none mb-2">Automated Holiday Roadmap</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Bahire Hasab Intelligence Feed</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-stone-50 dark:bg-white/5 p-2 rounded-2xl border border-[var(--border)]">
                    <button
                        onClick={controls.goPrev}
                        className="p-2 hover:bg-[#C5A059]/10 hover:text-[#C5A059] rounded-xl transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="px-6 py-2 text-sm font-black font-serif uppercase tracking-widest text-[#C5A059]">
                        {grid.monthName} {grid.year}
                    </div>
                    <button
                        onClick={controls.goNext}
                        className="p-2 hover:bg-[#C5A059]/10 hover:text-[#C5A059] rounded-xl transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                {/* Calendar Grid View */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-7 gap-2">
                        {grid.headers.map((h) => (
                            <div key={h} className="text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-4">
                                {h.slice(0, 3)}
                            </div>
                        ))}
                        {grid.days.map((day, i) => {
                            if (!day) return <div key={`empty-${i}`} className="aspect-square"></div>;

                            const isHoliday = day.holidays.length > 0;

                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className={`aspect-square relative rounded-2xl flex flex-col items-center justify-center border transition-all duration-500 group/day cursor-help
                                        ${isHoliday
                                            ? 'bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059] shadow-lg shadow-[#C5A059]/10'
                                            : 'bg-stone-50/50 dark:bg-white/5 border-[var(--border)] dark:border-white/5 text-slate-500 opacity-60 hover:opacity-100 hover:border-[#C5A059]/30'
                                        }`}
                                >
                                    <span className={`text-sm font-black ${isHoliday ? 'scale-110' : ''}`}>
                                        {day.ethiopian.day}
                                    </span>

                                    {isHoliday && (
                                        <>
                                            <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#C5A059] animate-pulse"></div>
                                            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 p-4 bg-[#1A1A1A] rounded-2xl text-[10px] font-medium text-white opacity-0 group-hover/day:opacity-100 pointer-events-none transition-all z-20 shadow-2xl border border-white/10">
                                                <p className="font-black text-[#C5A059] uppercase tracking-widest mb-1">{day.holidays[0].name?.english || day.holidays[0].name}</p>
                                                <p className="opacity-70 leading-relaxed line-clamp-2">{day.holidays[0].description?.english || day.holidays[0].description || 'Traditional holiday observations across the region.'}</p>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Holiday Insight Feed */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={14} className="text-[#C5A059]" />
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0">Monthly Awareness Feed</h3>
                        </div>

                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 scrollbar-thin">
                            <AnimatePresence>
                                {holidaysInMonth.length > 0 ? (
                                    holidaysInMonth.map((item, idx) => (
                                        <motion.div
                                            key={`${grid.year}-${grid.month}-${item.day}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="p-5 rounded-3xl bg-stone-50 dark:bg-white/5 border border-[var(--border)] dark:border-white/5 hover:border-[#C5A059]/20 transition-all group/item"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-full uppercase tracking-widest">
                                                        {item.day}
                                                    </span>
                                                    <h4 className="text-sm font-black font-serif tracking-tight">{item.holidays[0].name?.english || item.holidays[0].name}</h4>
                                                </div>
                                                <div className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <MapPin size={12} />
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                                {item.holidays[0].description?.english || item.holidays[0].description || 'Traditional holiday observations across the region.'}
                                            </p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-stone-50 dark:bg-white/5 rounded-3xl border border-dashed border-[var(--border)]">
                                        <Info size={24} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No major public events detected for this cycle.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mt-auto p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10">
                        <div className="flex items-center gap-3 mb-3">
                            <Info className="text-indigo-500" size={16} />
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Executive Strategy Note</p>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                            Cultural intelligence is synchronized with your Yield Engine. These events typically drive 15-40% domestic volume spikes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
