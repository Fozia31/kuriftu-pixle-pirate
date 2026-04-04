import { useState } from 'react';
import apiClient from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SMSCampaignCenter from './SMSCampaignCenter';
import AssistantBubble from './AssistantBubble';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, TrendingUp, Sparkles, Compass, Brain, CalendarDays, FileText, Trash2 } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Kenat, { getHoliday, getHolidaysForYear, HolidayTags } from 'kenat';
import { useMonthGrid } from 'kenat-ui';

// --- Mini Holiday Feed (compact sidebar widget) ---
function getCurrentEthiopian() {
    try { return new Kenat(new Date()).getEthiopian(); }
    catch { return { year: 2017, month: 7, day: 1 }; }
}
const MINI_INIT = getCurrentEthiopian();

function MiniHolidayFeed() {
    const [options, setOptions] = useState({ year: MINI_INIT.year, month: MINI_INIT.month, holidayFilter: [HolidayTags.PUBLIC, HolidayTags.RELIGIOUS, HolidayTags.CULTURAL] });
    const { grid, controls } = useMonthGrid(options);
    if (!grid) return null;
    const holidays = grid.days.filter(d => d && d.holidays?.length > 0).map(d => ({ day: d.ethiopian.day, name: d.holidays[0].name?.english || d.holidays[0].name }));
    return (
        <div className="mt-4 p-5 rounded-3xl bg-stone-50 dark:bg-white/5 border border-[var(--border)] dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Eth. Holiday Feed</span>
                <div className="flex items-center gap-1">
                    <button onClick={controls.goPrev} className="p-1 hover:text-[#C5A059] rounded-lg transition-colors text-slate-400">‹</button>
                    <span className="text-[9px] font-black text-slate-500 px-1">{grid.monthName} {grid.year}</span>
                    <button onClick={controls.goNext} className="p-1 hover:text-[#C5A059] rounded-lg transition-colors text-slate-400">›</button>
                </div>
            </div>
            <div className="space-y-2">
                {holidays.length === 0 ? (
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">No major holidays this month</p>
                ) : (
                    holidays.map((h, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-[#C5A059] w-4">{h.day}</span>
                            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 truncate">{h.name}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function KnowledgeUpload() {
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [fileName, setFileName] = useState('');
    const [documents, setDocuments] = useState([]);

    const fetchDocuments = async () => {
        try {
            const response = await apiClient.get('/revenue/documents');
            setDocuments(response.data);
        } catch (err) {
            console.error('Failed to fetch documents');
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFileName(selectedFile.name);
        setStatus('uploading');

        const formData = new FormData();
        formData.append('pdf', selectedFile);
        formData.append('topic', 'Admin Uploaded Manual');

        try {
            await apiClient.post('/revenue/upload-knowledge', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus('success');
            fetchDocuments(); // Refresh the list
            setTimeout(() => {
                setStatus('idle');
                setFileName('');
            }, 4000);
        } catch (err) {
            console.error('Upload failed');
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently delete this document and its AI vector memory?")) return;
        try {
            await apiClient.delete(`/revenue/documents/${id}`);
            fetchDocuments();
        } catch (err) {
            console.error('Delete failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="mt-8 p-8 rounded-[40px] bg-stone-50 dark:bg-white/5 border border-dashed border-[#C5A059]/30 relative overflow-hidden transition-all hover:bg-stone-100 dark:hover:bg-white/[0.07] group">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={40} className="text-[#C5A059]" /></div>
                
                <h4 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Sparkles size={12} />
                    Knowledge Enrichment Protocol
                </h4>

                <div className="relative">
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                        id="pdf-upload"
                        disabled={status === 'uploading'}
                    />
                    
                    <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[32px] transition-all duration-500 ${
                        status === 'uploading' ? 'border-[#C5A059] bg-[#C5A059]/5 animate-pulse' : 
                        status === 'success' ? 'border-emerald-500 bg-emerald-500/5' :
                        status === 'error' ? 'border-rose-500 bg-rose-500/5' :
                        'border-stone-200 dark:border-white/10 group-hover:border-[#C5A059]/50'
                    }`}>
                        {status === 'idle' && (
                            <>
                                <Compass className="text-slate-400 mb-4 group-hover:text-[#C5A059] transition-colors" size={32} />
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest text-center">
                                    {fileName || "Select Property Manual (PDF)"}
                                </p>
                                <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest opacity-50 text-center">Choose File to Begin Auto-Vectorization</p>
                            </>
                        )}

                        {status === 'uploading' && (
                            <>
                                <div className="w-10 h-10 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin mb-4"></div>
                                <p className="text-xs font-black text-[#C5A059] uppercase tracking-[0.2em] animate-pulse">Vectorizing Content...</p>
                                <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest">{fileName}</p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20">
                                    <Sparkles size={20} />
                                </div>
                                <p className="text-xs font-black text-emerald-500 uppercase tracking-widest text-center">Knowledge Ingested Successfully</p>
                                <p className="text-[9px] text-emerald-500/60 mt-1 font-bold text-center">AI Brain Updated with New Patterns</p>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-500/20">
                                    <Compass size={20} className="rotate-45" />
                                </div>
                                <p className="text-xs font-black text-rose-500 uppercase tracking-widest">Ingestion Failed</p>
                                <p className="text-[9px] text-rose-500/60 mt-1 font-bold">Verification Error - Please Retry</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Document Library (Bottom View) */}
            <div className="p-6 rounded-[32px] bg-stone-50 dark:bg-white/5 border border-[var(--border)] dark:border-white/5">
                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <FileText size={10} />
                    Resort Knowledge Library ({documents.length})
                </h5>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {documents.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest py-4 text-center opacity-40 italic">No Specialized Knowledge Injected Yet</p>
                    ) : (
                        documents.map((doc) => (
                            <div key={doc._id} className="p-4 rounded-2xl bg-white dark:bg-black/20 border border-[var(--border)] dark:border-white/5 flex items-center justify-between group/item hover:border-[#C5A059]/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-white/5 flex items-center justify-center text-[#C5A059]">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-600 dark:text-slate-300 truncate max-w-[180px]">{doc.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                                {Math.round(doc.size / 1024)} KB · {new Date(doc.uploadDate).toLocaleDateString()}
                                            </p>
                                            <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-[#C5A059]/10 text-[#C5A059] font-black uppercase tracking-tighter flex items-center gap-1">
                                                <Brain size={8} />
                                                {doc.intelligenceChunks || 0} Chunks
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(doc._id)}
                                    className="p-2.5 rounded-xl hover:bg-rose-500/10 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-item-hover:opacity-100"
                                    title="Wipe Intelligence"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}



export default function Dashboard() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const role = user?.role;
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        baseRoomPrice: 150,
        baseSpaPrice: 60,
        baseWaterparkPrice: 25,
        branch: 'Kuriftu Resort & Spa Bishoftu (Debre Zeit)',
    });

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [syncedActions, setSyncedActions] = useState([]);
    const [graphFilter, setGraphFilter] = useState('all');
    const [showEthCalendar, setShowEthCalendar] = useState(true);
    const [calendarMode, setCalendarMode] = useState('greg'); // 'greg' or 'eth'
    
    // Ethiopian Date States
    const initialEthDate = new Kenat().getEthiopian();
    const [ethSelected, setEthSelected] = useState({
        day: initialEthDate.day,
        month: initialEthDate.month,
        year: initialEthDate.year
    });
    const [specialDay, setSpecialDay] = useState(null);

    // Initial Dashboard Context Load (Live Data)
    useEffect(() => {
        const initializeDashboard = async () => {
            setLoading(true);
            try {
                // FETCH ACTUAL LIVE DATA FROM BACKEND FOR SELECTED BRANCH
                const response = await apiClient.get('/revenue/live', { 
                    params: { branch: formData.branch } 
                });
                setData(response.data);
                
                // Keep simulation form in sync with real-time reality
                setFormData(prev => ({
                    ...prev,
                    baseRoomPrice: response.data.pricing?.baseRoomPrice || 150,
                    baseSpaPrice: response.data.pricing?.baseSpaPrice || 60,
                    baseWaterparkPrice: response.data.pricing?.baseWaterparkPrice || 25,
                }));
            } catch (err) {
                console.warn("Initial load failed, falling back to simulation defaults.");
            } finally {
                setLoading(false);
            }
        };
        initializeDashboard();
    }, [formData.branch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSyncAction = (index) => {
        setSyncedActions(prev => [...prev, index]);
    }

    // Update Ethiopian Selects when Gregorian Date Changes
    useEffect(() => {
        const kDate = new Kenat(new Date(formData.date));
        const eth = kDate.getEthiopian();
        
        if (calendarMode === 'greg') {
            setEthSelected({ day: eth.day, month: eth.month, year: eth.year });
        }
        
        // Correctly find special day using Kenat year-wide holiday list
        try {
            const holidays = getHolidaysForYear(eth.year, { lang: 'english' });
            const match = holidays.find(h => h.ethiopian.month === eth.month && h.ethiopian.day === eth.day);
            setSpecialDay(match ? (match.name.english || match.name) : null);
        } catch (e) {
            console.error("Holiday detection failed:", e);
            setSpecialDay(null);
        }
    }, [formData.date, calendarMode]);

    const handleEthSelectChange = (field, value) => {
        const newEth = { ...ethSelected, [field]: Number(value) };
        setEthSelected(newEth);
        
        // Convert to Gregorian and update formData
        try {
            const kDate = new Kenat(newEth.year, newEth.month, newEth.day);
            const greg = kDate.toGregorian();
            setFormData(prev => ({ ...prev, date: greg.toISOString().split('T')[0] }));
        } catch (e) {
            console.error("Invalid Ethiopian Date selected:", e);
        }
    };

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
        if (data.holidayName) {
            insight = `Detected ${data.holidayName} event. Yield parameters have been auto-adjusted to capture the cultural demand spike.`;
        } else if (formData.baseRoomPrice > 210 && data.demands.roomDemand < 60) {
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
                        {/* Ethiopian Calendar Context Badge */}
                        <AnimatePresence>
                            {showEthCalendar && data?.ethiopianDate && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-full"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></div>
                                    <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest leading-none flex items-center gap-2">
                                        <span className="opacity-60">{formattedTargetDate}</span>
                                        <span className="opacity-30">|</span>
                                        <span>{data.ethiopianDate}</span>
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center gap-3 pr-8 border-r border-[var(--border)] dark:border-white/5">
                            <button
                                onClick={() => setShowEthCalendar(!showEthCalendar)}
                                title="Toggle Ethiopian Calendar Visibility"
                                className={`p-3 rounded-full transition-all flex items-center justify-center ${showEthCalendar ? 'bg-[#C5A059]/10 text-[#C5A059]' : 'bg-stone-100 dark:bg-white/5 text-slate-400 opacity-50'}`}
                            >
                                <CalendarDays size={18} />
                            </button>
                            <ThemeToggle />
                        </div>

                        <div className="flex items-center gap-4">
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


                {/* ROW 2: KPIs */}
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
                                <p className={`text-4xl font-serif font-black tracking-tighter ${kpi.color || 'text-[var(--foreground)]'}`}>{kpi.value}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">{kpi.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Inflation Context (NEW LUXURY CARD) */}
                {data?.inflationRate && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-[40px] bg-amber-500/5 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-inner"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
                                <TrendingUp size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-serif font-black tracking-tight leading-tight">Economic Pressure: {data.inflationRate}%</h4>
                                <p className="text-[10px] font-black text-amber-600/60 dark:text-amber-500/60 uppercase tracking-[0.2em] mt-1 italic">Strategically factoring price elasticity for the regional market</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-12">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact on GP</p>
                                <p className="text-xl font-serif font-black text-rose-500">-${data.revenue.inflationImpact?.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">True Market Value</p>
                                <p className="text-2xl font-serif font-black text-emerald-500">${data.revenue.inflationAdjustedTotal?.toLocaleString()}</p>
                            </div>
                        </div>
                    </motion.div>
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
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Target Analysis Date</label>
                                    <button 
                                        type="button"
                                        onClick={() => setCalendarMode(calendarMode === 'greg' ? 'eth' : 'greg')}
                                        className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] flex items-center gap-2 hover:bg-[#C5A059]/5 px-3 py-1 rounded-full transition-all"
                                    >
                                        <Compass size={12} />
                                        Switch to {calendarMode === 'greg' ? 'Eth' : 'Greg'} Calendar
                                    </button>
                                </div>

                                {calendarMode === 'greg' ? (
                                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-stone-50 dark:bg-black/20 border border-[var(--border)] dark:border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#C5A059]/50 transition-all outline-none" />
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Month</label>
                                                <select 
                                                    value={ethSelected.month} 
                                                    onChange={(e) => handleEthSelectChange('month', e.target.value)}
                                                    className="w-full bg-stone-50 dark:bg-black/20 border border-[var(--border)] dark:border-white/5 rounded-xl px-3 py-3 text-[10px] font-black tracking-widest uppercase outline-none focus:border-[#C5A059]/50"
                                                >
                                                    {['Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehasse', 'Pagume'].map((m, i) => (
                                                        <option key={m} value={i + 1}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Day</label>
                                                <select 
                                                    value={ethSelected.day} 
                                                    onChange={(e) => handleEthSelectChange('day', e.target.value)}
                                                    className="w-full bg-stone-50 dark:bg-black/20 border border-[var(--border)] dark:border-white/5 rounded-xl px-3 py-3 text-[10px] font-black tracking-widest uppercase outline-none focus:border-[#C5A059]/50"
                                                >
                                                    {[...Array(ethSelected.month === 13 ? 6 : 30)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Year</label>
                                                <select 
                                                    value={ethSelected.year} 
                                                    onChange={(e) => handleEthSelectChange('year', e.target.value)}
                                                    className="w-full bg-stone-50 dark:bg-black/20 border border-[var(--border)] dark:border-white/5 rounded-xl px-3 py-3 text-[10px] font-black tracking-widest uppercase outline-none focus:border-[#C5A059]/50"
                                                >
                                                    {[2015, 2016, 2017, 2018, 2019, 2020].map(y => (
                                                        <option key={y} value={y}>{y}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {/* User Friendly Date Context */}
                                        <div className="px-1 py-2 border-t border-[var(--border)] dark:border-white/5 flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                                {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long' })} · Week {Math.ceil(new Date(formData.date).getDate() / 7)}
                                            </span>
                                            {ethSelected.month === 13 && (
                                                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                                                    Intercalary Month
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {specialDay && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-4 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-2xl flex items-center gap-4 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                            <Sparkles size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest leading-none mb-1">Cultural Pulse</p>
                                            <p className="text-sm font-black font-serif text-[var(--foreground)]">{specialDay}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {showEthCalendar && data?.ethiopianDate && (
                                    <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest px-1 mt-2 animate-pulse flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-[#1A1A1A] dark:bg-white/20 rounded-full"></span>
                                        <span className="opacity-60">Greg: {formattedTargetDate}</span>
                                        <span className="opacity-30">|</span>
                                        <span>Eth: {data.ethiopianDate}</span>
                                    </p>
                                )}
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
                                        Real-Time Context: Kuriftu Portfolio
                                    </h4>
                                    
                                    <div className="pt-2">
                                        <select 
                                            name="branch" 
                                            value={formData.branch} 
                                            onChange={handleInputChange}
                                            className="w-full p-4 rounded-2xl bg-stone-100 dark:bg-white/10 border border-[var(--border)] dark:border-white/10 text-[10px] font-black uppercase tracking-wider focus:ring-2 focus:ring-[#C5A059] transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="Kuriftu Resort & Spa Bishoftu (Debre Zeit)">Kuriftu Bishoftu (Debre Zeit)</option>
                                            <option value="Kuriftu Resort & Spa Bahir Dar">Kuriftu Bahir Dar (Lake Tana)</option>
                                            <option value="Kuriftu Resort & Spa Entoto">Kuriftu Entoto Forest</option>
                                            <option value="Kuriftu Water Park">Kuriftu Water Park</option>
                                            <option value="Kuriftu African Village (Bishoftu)">Kuriftu African Village</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-between text-xs font-bold pt-2">
                                        <span className="text-slate-500 uppercase tracking-widest">Weather ({data.liveWeatherDetails.city}):</span>
                                        <span className="text-slate-400">{data.liveWeatherDetails.tempC}°C · {data.liveWeatherDetails.category}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold items-center">
                                        <span className="text-slate-500 uppercase tracking-widest">Peace Index:</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${data.stabilityDetails?.index < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${data.stabilityDetails?.index}%` }}
                                                ></div>
                                            </div>
                                            <span className={data.stabilityDetails?.index < 50 ? 'text-rose-500' : 'text-emerald-500'}>{data.stabilityDetails?.index}/100</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn-gold w-full mt-auto tracking-[0.2em] text-[10px] min-h-[56px]">
                                {loading ? "Optimizing..." : "Execute Prediction"}
                            </button>

                            {role === 'EXECUTIVE_ADMIN' && (
                                <div className="mt-4 bg-stone-50 dark:bg-white/5 border border-[var(--border)] dark:border-white/5 rounded-2xl p-6 flex flex-col justify-center text-center group transition-all hover:border-[#C5A059]/30 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.2em] mb-2 relative z-10">Strategic Impact Forecast</p>
                                    <div className="flex items-center justify-center gap-6 relative z-10">
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-50">Baseline</p>
                                            <p className="text-sm font-serif font-black text-slate-300 line-through opacity-30 tabular-nums font-mono">
                                                ${beforeTotal.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="w-px h-8 bg-[var(--border)] dark:bg-white/10 shrink-0"></div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-[#C5A059] uppercase tracking-widest mb-1">T-ARO AI</p>
                                            <p className="text-2xl font-serif font-black text-emerald-500 tabular-nums font-mono tracking-tighter">
                                                {data ? `$${data.revenue.totalRevenue.toLocaleString()}` : "---"}
                                            </p>
                                        </div>
                                    </div>
                                    {data && (
                                        <div className="mt-3 py-1 bg-emerald-500/10 rounded-full inline-block mx-auto px-4 relative z-10">
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                                +${(data.revenue.totalRevenue - beforeTotal).toLocaleString()} Uplift
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mini Ethiopian Holiday Feed */}
                            <MiniHolidayFeed />

                            {/* Knowledge Enrichment (Admin ONLY) */}
                            {role === 'EXECUTIVE_ADMIN' && <KnowledgeUpload />}
                        </form>
                    </div>

                    {/* RIGHT: Visual Analytics */}
                    <div className="lg:col-span-8 flex flex-col gap-10">
                        {/* Executive Strategy Briefing (New Luxury Component) - Moved to Top */}
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

                        {/* Intelligence Yield Map (Bar Chart) - Moved Below Briefing */}
                        <div className="bg-[var(--card)] p-10 rounded-[56px] border border-[var(--border)] dark:border-white/5 shadow-2xl min-h-[450px] flex flex-col">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-2xl font-serif font-black tracking-tight">Intelligence Yield Map</h2>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Predicted Departmental Revenue Share</p>
                                </div>

                                {/* Custom Show in Graph Dropdown */}
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Show in Graph:</span>
                                    <select 
                                        value={graphFilter} 
                                        onChange={(e) => setGraphFilter(e.target.value)}
                                        className="bg-stone-50 dark:bg-white/5 border border-[var(--border)] rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#C5A059]/50 transition-all cursor-pointer"
                                    >
                                        <option value="all">All Departments</option>
                                        <option value="rooms">Rooms Only</option>
                                        <option value="spa">Spa Only</option>
                                        <option value="f_b">F&B Only</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex-1 w-full min-h-[400px]">
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                                        <XAxis dataKey="day" stroke="currentColor" tick={{ fontSize: 10, fontWeight: 800, opacity: 0.4 }} tickLine={false} axisLine={false} dy={15} />
                                        <YAxis hide />
                                        <Tooltip cursor={{ fill: 'rgba(197, 160, 89, 0.05)' }} contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }} />
                                        <Legend iconType="rect" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', paddingTop: '30px', opacity: 0.5 }} />
                                        {(graphFilter === 'all' || graphFilter === 'rooms') && canViewRooms && <Bar dataKey="Rooms" stackId="a" fill={theme === 'dark' ? '#1A1D23' : '#1A1A1A'} radius={[4, 4, 0, 0]} />}
                                        {(graphFilter === 'all' || graphFilter === 'spa') && canViewActivities && <Bar dataKey="Spa" stackId="a" fill="#C5A059" radius={(graphFilter === 'all' && canViewRooms) ? [0, 0, 0, 0] : [4, 4, 0, 0]} />}
                                        {(graphFilter === 'all' || graphFilter === 'f_b') && canViewActivities && <Bar dataKey="F_B" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

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


            </div>

            {/* AI Assistant Hook */}
            <AssistantBubble dashboardContext={{ ...data, role, theme }} />
        </div>
    );
}
