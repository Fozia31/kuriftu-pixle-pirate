import { useState } from 'react';
import apiClient from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SMSCampaignCenter from './SMSCampaignCenter';
import AssistantBubble from './AssistantBubble';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, TrendingUp, Sparkles, Compass, Brain } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const role = user?.role;
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        baseRoomPrice: 150,
        baseSpaPrice: 60,
        baseWaterparkPrice: 30,
    });

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [syncedActions, setSyncedActions] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSyncAction = (index) => {
        setSyncedActions(prev => [...prev, index]);
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSyncedActions([]);

        try {
            const payload = {
                date: formData.date,
                baseRoomPrice: Number(formData.baseRoomPrice),
                baseSpaPrice: Number(formData.baseSpaPrice),
                baseWaterparkPrice: Number(formData.baseWaterparkPrice)
            };

            const response = await apiClient.post('/revenue/total', payload);
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch Data.');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const formattedTargetDate = new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const chartData = [
        { day: 'Mon', Rooms: 2000, Spa: 600, F_B: 800 },
        { day: 'Tue', Rooms: 2500, Spa: 500, F_B: 700 },
        { day: 'Wed', Rooms: 3000, Spa: 800, F_B: 1200 },
        { day: 'Thu', Rooms: 4000, Spa: 1500, F_B: 2000 },
        { day: 'Fri', Rooms: 6500, Spa: 2500, F_B: 3500 },
        { day: 'Sat', Rooms: 9000, Spa: 4000, F_B: 5500 },
        {
            day: `Target (${formattedTargetDate})`,
            Rooms: data ? data.revenue.breakdown.room : 5000,
            Spa: data ? data.revenue.breakdown.spa : 2000,
            F_B: data ? data.revenue.breakdown.waterpark : 3000
        },
    ];

    const fallbackBeforeTotal = ((100 * 0.4) * Number(formData.baseRoomPrice)) +
        ((50 * 0.4) * Number(formData.baseSpaPrice)) +
        ((200 * 0.4) * Number(formData.baseWaterparkPrice));
    const beforeTotal = data && data.revenue.beforeTotal ? data.revenue.beforeTotal : fallbackBeforeTotal;

    const canViewRooms = role === 'EXECUTIVE_ADMIN' || role === 'ROOM_MANAGER';
    const canViewActivities = role === 'EXECUTIVE_ADMIN' || role === 'SPA_MANAGER';

    const getStrategyNarrative = () => {
        if (!data) return null;
        
        const upliftPercent = (((data.revenue.totalRevenue - beforeTotal) / beforeTotal) * 100).toFixed(1);
        const perGuestUplift = ((data.revenue.totalRevenue - beforeTotal) / 100).toFixed(2);
        
        let insight = "The ecosystem is currently balanced, with room occupancy and ancillary services showing healthy synergy.";
        if (formData.baseRoomPrice > 210 && data.demands.roomDemand < 60) {
            insight = "Current pricing is aggressive. While Yield per room is high, we risk a -15% drop in total departmental flow-through.";
        } else if (data.demands.spaDemand < data.demands.roomDemand * 0.7) {
            insight = "Room occupancy is driving the chart, but ancillary revenue (Spa/Dining) is under-performing by 22%.";
        }

        return {
            insight,
            actions: [
                data.demands.spaDemand < 50 ? "Pivot to a 'Wellness Bundle' for the upcoming weekend to bridge the Spa capacity gap." : "Maintain current wellness yields. Monitor weekend cancellation trends.",
                formData.baseRoomPrice > 180 ? "Implement a 'Sunset Dining' upsell at check-in for guests in Presidential Suites." : "Leverage 'Lakeside Fusion' dining as a primary driver for non-resident foot traffic."
            ],
            impact: { percent: upliftPercent, dollar: perGuestUplift }
        };
    };

    const narrative = getStrategyNarrative();

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-20 font-sans transition-colors duration-500 overflow-x-hidden relative selection:bg-amber-500/20">

            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-[#C5A059] to-[#D4AF37] w-10 h-10 rounded-xl shadow-lg flex items-center justify-center">
                            <Compass className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-black tracking-tight leading-none mb-1">Kuriftu Intelligence</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Executive Strategy Terminal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <ThemeToggle />
                        <div className="flex items-center gap-4 pl-8 border-l border-[var(--border)] dark:border-white/5">
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-sm font-bold leading-none mb-1">{user?.name}</span>
                                <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">{role?.replace('_', ' ')}</span>
                            </div>
                            <button
                            onClick={handleLogout}
                            className="p-3 bg-stone-100 dark:bg-white/5 rounded-full hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                        >        <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto mt-12 px-6 space-y-10 relative z-10">

                {/* ROW 1: KPIs */}
                {role === 'EXECUTIVE_ADMIN' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Predicted Yield', value: data ? `$${data.revenue.trevpar.toFixed(2)}` : '---', sub: 'TrevPAR Target', color: 'text-[#C5A059]' },
                            { label: 'Room Demand', value: data ? `${data.demands.roomDemand}%` : '--%', sub: 'Projected Occupancy' },
                            { label: 'Wellness Flow', value: data ? `${data.demands.spaDemand}%` : '--%', sub: 'Spa Capacity Target' },
                            { label: 'Waterpark Hub', value: data ? `${data.demands.waterparkDemand}%` : '--%', sub: 'Day-Guest Volume' }
                        ].map((kpi, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[var(--card)] p-8 rounded-[40px] border border-[var(--border)] dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 group"
                            >
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{kpi.label}</h3>
                                <p className={`text-5xl font-serif font-black tracking-tighter ${kpi.color || 'text-[var(--foreground)]'}`}>{kpi.value}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">{kpi.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* MIDDLE SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT: Simulation Engine */}
                    <div className="lg:col-span-4 bg-[var(--card)] p-10 rounded-[56px] border border-[var(--border)] dark:border-white/5 flex flex-col shadow-2xl relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-10">
                            <TrendingUp className="text-[#C5A059]" size={20} />
                            <h2 className="text-xl font-serif font-black tracking-tight">Yield Simulation</h2>
                        </div>

                        <form onSubmit={handleAnalyze} className="space-y-8 flex-1 flex flex-col">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Target Analysis Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-stone-50 dark:bg-black/20 border border-[var(--border)] dark:border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#C5A059]/50 transition-all outline-none" />
                            </div>

                            {[
                                { name: 'baseRoomPrice', label: 'Room Rate', value: formData.baseRoomPrice, color: 'accent-[#1A1A1A] dark:accent-indigo-400', visible: canViewRooms },
                                { name: 'baseSpaPrice', label: 'Spa Entry', value: formData.baseSpaPrice, color: 'accent-[#C5A059]', visible: canViewActivities },
                                { name: 'baseWaterparkPrice', label: 'Water Access', value: formData.baseWaterparkPrice, color: 'accent-emerald-500', visible: canViewActivities }
                            ].map(slider => slider.visible && (
                                <div key={slider.name} className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{slider.label}</span>
                                        <span className="text-sm font-black font-serif">${slider.value}</span>
                                    </div>
                                    <input type="range" name={slider.name} value={slider.value} onChange={handleInputChange} min="10" max="400" className={`w-full h-1.5 bg-stone-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer ${slider.color}`} />
                                </div>
                            ))}

                            {data?.liveWeatherDetails && (
                                <div className="p-8 rounded-[32px] bg-stone-50 dark:bg-white/5 border border-[var(--border)] dark:border-white/5 space-y-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={60} /></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] flex items-center gap-3">
                                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                                        Real-Time Context
                                    </h4>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500 uppercase tracking-widest">Weather:</span>
                                        <span className="text-slate-400">{data.liveWeatherDetails.tempC}°C · {data.liveWeatherDetails.category}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500 uppercase tracking-widest">Peace Index:</span>
                                        <span className={data.stabilityDetails?.index < 50 ? 'text-rose-500' : 'text-emerald-500'}>{data.stabilityDetails?.index}/100</span>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn-gold w-full mt-auto tracking-[0.2em] text-[10px]">
                                {loading ? "Optimizing..." : "Execute Prediction"}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT: Visual Analytics */}
                    <div className="lg:col-span-8 flex flex-col gap-10">
                        <div className="bg-[var(--card)] p-10 rounded-[56px] border border-[var(--border)] dark:border-white/5 shadow-2xl min-h-[450px] flex flex-col">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-2xl font-serif font-black tracking-tight">Intelligence Yield Map</h2>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Predicted Departmental Revenue Share</p>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                                        <XAxis dataKey="day" stroke="currentColor" tick={{ fontSize: 10, fontWeight: 800, opacity: 0.4 }} tickLine={false} axisLine={false} dy={15} />
                                        <YAxis hide />
                                        <Tooltip cursor={{ fill: 'rgba(197, 160, 89, 0.05)' }} contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }} />
                                        <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', paddingTop: '30px', opacity: 0.5 }} />
                                        {canViewRooms && <Bar dataKey="Rooms" stackId="a" fill={theme === 'dark' ? '#1A1D23' : '#1A1A1A'} radius={[4, 4, 0, 0]} />}
                                        {canViewActivities && <Bar dataKey="Spa" stackId="a" fill="#C5A059" radius={canViewRooms ? [0, 0, 0, 0] : [4, 4, 0, 0]} />}
                                        {canViewActivities && <Bar dataKey="F_B" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        {/* Executive Strategy Briefing (New Luxury Component) */}
                        {data && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#FAF9F6]/90 dark:bg-stone-900/40 backdrop-blur-3xl p-10 rounded-[56px] border border-[#C5A059]/20 shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12">
                                    <Brain size={180} />
                                </div>
                                <div className="flex items-center justify-between mb-10 relative z-10">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4">
                                        <div className="p-2.5 bg-indigo-500/10 rounded-xl animate-pulse">
                                            <Brain className="text-indigo-500" size={18} />
                                        </div>
                                        Executive Intelligence Briefing
                                    </h3>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/5 px-4 py-1.5 rounded-full border border-[#C5A059]/20">
                                        AI Analysis Active
                                    </span>
                                </div>

                                <div className="space-y-12 relative z-10">
                                    <div className="space-y-4">
                                        <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Yield Insights</p>
                                        <p className="text-xl font-serif font-black leading-snug max-w-2xl text-[var(--foreground)]">
                                            "{narrative.insight}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Strategic Action Plan</p>
                                            <ul className="space-y-4">
                                                {narrative.actions.map((act, i) => (
                                                    <li key={i} className="flex gap-4 items-start group/li">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 group-hover/li:scale-150 transition-transform"></div>
                                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">{act}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-[#C5A059]/5 p-8 rounded-[40px] border border-[#C5A059]/10 flex flex-col justify-center items-center text-center">
                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Projected Impact</p>
                                            <h4 className="text-4xl font-serif font-black text-[#C5A059] flex flex-col gap-1 tracking-tighter">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#D4AF37]">
                                                    +{narrative.impact.percent}%
                                                </span>
                                            </h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Target TrevPAR Uplift</p>
                                            <p className="text-[9px] font-bold text-[#C5A059] mt-2 italic shadow-sm tracking-widest">($${narrative.impact.dollar} per guest)</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* AI Action Execution (Glassmorphic) */}
                        <div className="p-1 rounded-[40px] bg-gradient-to-r from-stone-200 to-stone-300 dark:from-white/5 dark:to-white/10">
                            <div className="bg-[var(--card)] rounded-[39px] p-10">
                                <h3 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                    <Sparkles size={16} className="animate-pulse" />
                                    Smart Strategy Protocol
                                </h3>
                                {data ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {data.actions.map((act, i) => {
                                            const isSynced = syncedActions.includes(i);
                                            return (
                                                <div key={i} className={`p-8 rounded-[32px] border transition-all duration-500 flex flex-col justify-between h-full ${isSynced ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-stone-50 dark:bg-white/5 border-[var(--border)] dark:border-white/5 hover:border-[#C5A059]/30'}`}>
                                                    <p className="text-sm font-medium leading-relaxed mb-8">{act}</p>
                                                    <button onClick={() => handleSyncAction(i)} disabled={isSynced} className={`text-[9px] font-black uppercase tracking-widest py-3 rounded-xl border transition-all ${isSynced ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-transparent border-[var(--border)] text-slate-500 hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059]'}`}>
                                                        {isSynced ? '✓ Operationalized' : 'Execute Proposal'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 font-medium tracking-wide">Enter simulation parameters and execute prediction to generate protocols.</p>
                                )}
                            </div>
                        </div>

                        {/* SMS Marketing Section */}
                        {data && (
                            <SMSCampaignCenter actions={data.actions} roomDemand={data.demands.roomDemand} theme={theme} />
                        )}
                    </div>
                </div>

                {/* BOTTOM: Final Strategy Uplift */}
                {data && role === 'EXECUTIVE_ADMIN' && (
                    <div className="bg-[var(--card)] border border-[var(--border)] dark:border-white/5 p-16 rounded-[64px] shadow-3xl text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-16 relative z-10">Economic Impact Analysis</h2>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-20 relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Baseline Strategy</p>
                                <p className="text-5xl font-serif font-black text-slate-300 tracking-tighter">${beforeTotal.toLocaleString()}</p>
                            </div>
                            <div className="w-px h-20 bg-[var(--border)] dark:bg-white/5 hidden md:block"></div>
                            <div>
                                <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-4">T-ARO AI Strategy</p>
                                <p className="text-8xl font-serif font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#D4AF37]">
                                    ${data.revenue.totalRevenue.toLocaleString()}
                                </p>
                                <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-6 animate-bounce">
                                    +${(data.revenue.totalRevenue - beforeTotal).toLocaleString()} Strategic Uplift
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Assistant Hook */}
            <AssistantBubble dashboardContext={{ ...data, role, theme }} />
        </div>
    );
}
