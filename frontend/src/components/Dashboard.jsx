import { useState } from 'react';
import apiClient from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SMSCampaignCenter from './SMSCampaignCenter';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const role = user?.role;
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        baseRoomPrice: 100,
        baseSpaPrice: 50,
        baseWaterparkPrice: 25,
    });

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    // Track which AI actions have been manually pushed to the booking system
    const [syncedActions, setSyncedActions] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSyncAction = (index) => {
        setSyncedActions(prev => [...prev, index]);
    }

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSyncedActions([]); // Reset syncs when new data arrives

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

    return (
        <div className="min-h-screen bg-[#060913] text-slate-200 font-['Outfit',sans-serif] pb-16 overflow-x-hidden relative selection:bg-indigo-500/30">

            {/* Background Decorators */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                        <span className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 w-8 h-8 rounded-lg shadow-lg shadow-indigo-500/30">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        </span>
                        Kuriftu Resort <span className="font-light text-slate-400">| Smart Dashboard</span>
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                <User size={16} className="text-indigo-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white leading-none">{user?.name}</span>
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{role?.replace('_', ' ')}</span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto mt-10 px-6 space-y-8 relative z-10">

                {/* ROW 1: KPIs */}
                {role === 'Admin' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-[#12192B] to-[#0A0E1A] p-6 rounded-3xl border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)] hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[25px] blur opacity-0 group-hover:opacity-20 transition duration-500 -z-10"></div>
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Total Revenue</h3>
                            <p className="text-5xl font-black text-white tracking-tight">${data ? data.revenue.trevpar.toFixed(2) : '---'}</p>
                            <div className="text-xs text-indigo-300/60 mt-3 font-medium">Daily Revenue Per Available Room</div>
                        </div>
                        <div className="bg-[#12192B]/80 backdrop-blur p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 hover:-translate-y-1 hover:bg-[#151D33] transition-all duration-300">
                            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Room Occupancy</h3>
                            <p className="text-4xl font-black text-white mt-1">{data ? data.demands.roomDemand : '--'}%</p>
                        </div>
                        <div className="bg-[#12192B]/80 backdrop-blur p-6 rounded-3xl border border-white/5 hover:border-amber-500/30 hover:-translate-y-1 hover:bg-[#151D33] transition-all duration-300">
                            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Spa Bookings</h3>
                            <p className="text-4xl font-black text-white mt-1">{data ? data.demands.spaDemand : '--'}%</p>
                        </div>
                        <div className="bg-[#12192B]/80 backdrop-blur p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 hover:-translate-y-1 hover:bg-[#151D33] transition-all duration-300">
                            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Waterpark Flow</h3>
                            <p className="text-4xl font-black text-white mt-1">{data ? data.demands.waterparkDemand : '--'}%</p>
                        </div>
                    </div>
                )}

                {/* MIDDLE SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: Controls */}
                    <div className="lg:col-span-4 bg-[#12192B] p-8 rounded-[32px] border border-white/5 flex flex-col shadow-2xl relative overflow-hidden group hover:border-indigo-500/20 transition-colors duration-500">
                        <h2 className="text-xl font-black tracking-wide mb-6 text-white flex items-center gap-2">
                            Revenue Prediction AI
                        </h2>

                        <form onSubmit={handleAnalyze} className="space-y-6 flex-1 flex flex-col relative z-10">

                            <div className="bg-[#0A0E1A] p-4 rounded-2xl border border-white/5 focus-within:border-indigo-500/50 transition-colors">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select Target Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-transparent text-base font-semibold text-white outline-none cursor-pointer" />
                            </div>

                            {canViewRooms && (
                                <div className="space-y-2">
                                    <label className="flex justify-between text-xs font-bold uppercase tracking-wide">
                                        <span className="text-slate-400">Standard Room Price</span>
                                        <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">${formData.baseRoomPrice}</span>
                                    </label>
                                    <input type="range" name="baseRoomPrice" value={formData.baseRoomPrice} onChange={handleInputChange} min="50" max="400" className="w-full h-2 rounded-full cursor-pointer appearance-none bg-slate-800 accent-blue-500 hover:accent-blue-400" />
                                </div>
                            )}

                            {canViewActivities && (
                                <div className="space-y-2">
                                    <label className="flex justify-between text-xs font-bold uppercase tracking-wide">
                                        <span className="text-slate-400">Spa Entry Price</span>
                                        <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">${formData.baseSpaPrice}</span>
                                    </label>
                                    <input type="range" name="baseSpaPrice" value={formData.baseSpaPrice} onChange={handleInputChange} min="30" max="150" className="w-full h-2 rounded-full cursor-pointer appearance-none bg-slate-800 accent-amber-500 hover:accent-amber-400" />
                                </div>
                            )}

                            {canViewActivities && (
                                <div className="space-y-2">
                                    <label className="flex justify-between text-xs font-bold uppercase tracking-wide">
                                        <span className="text-slate-400">Waterpark Ticket</span>
                                        <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">${formData.baseWaterparkPrice}</span>
                                    </label>
                                    <input type="range" name="baseWaterparkPrice" value={formData.baseWaterparkPrice} onChange={handleInputChange} min="10" max="80" className="w-full h-2 rounded-full cursor-pointer appearance-none bg-slate-800 accent-emerald-500 hover:accent-emerald-400" />
                                </div>
                            )}

                            {/* Live External Data */}
                            {data?.liveWeatherDetails && (
                                <div className="mt-4 p-5 bg-gradient-to-br from-[#0A0E1A] to-[#12192B] rounded-2xl border border-indigo-500/20 text-sm space-y-3 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-[30px] rounded-full"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-[10px] uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                                            Live AI Data Sources
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                        <span className="text-slate-500">Location Weather:</span>
                                        <span className="text-blue-300">{data.liveWeatherDetails.tempC}°C • <span className="capitalize">{data.liveWeatherDetails.category}</span></span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                        <span className="text-slate-500">Live Peace Score:</span>
                                        <span className={data.stabilityDetails?.index < 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{data.stabilityDetails?.index}/100 • {data.stabilityDetails?.status}</span>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full mt-auto bg-white/10 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg border border-white/10 hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 transform active:scale-95 disabled:opacity-50 tracking-wide">
                                {loading ? "Predicting..." : "Run AI Prediction"}
                            </button>
                        </form>
                    </div>

                    {/* CENTER: Stacked Bar Chart */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <div className="bg-[#12192B] p-8 rounded-[32px] border border-white/5 shadow-2xl flex-1 flex flex-col relative group hover:border-slate-700 transition duration-500">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-xl font-black text-white">Weekly Revenue Breakdown</h2>
                                    <p className="text-sm text-slate-500 font-medium">How revenue is split between Rooms, Spa, and Waterpark</p>
                                </div>
                                {data && <div className="hidden sm:block text-xs font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">AI Updated</div>}
                            </div>
                            <div className="flex-1 w-full min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 12, fontWeight: 600 }} dy={10} />
                                        <YAxis stroke="#475569" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} tick={{ fontSize: 12, fontWeight: 500 }} />
                                        <Tooltip cursor={{ fill: '#0f172a' }} contentStyle={{ backgroundColor: '#060913', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', padding: '12px 16px' }} itemStyle={{ fontWeight: 600, padding: '4px 0' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px', fontWeight: 500, color: '#94a3b8' }} />

                                        {canViewRooms && <Bar dataKey="Rooms" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />}
                                        {canViewActivities && <Bar dataKey="Spa" stackId="a" fill="#f59e0b" />}
                                        {canViewActivities && <Bar dataKey="F_B" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Dynamic AI Execution Commands */}
                        <div className="bg-purple-900/10 backdrop-blur p-6 rounded-[24px] border border-purple-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                            <h2 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Smart AI Recommendations
                            </h2>

                            {data ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {data.actions.map((act, i) => {
                                        const isSynced = syncedActions.includes(i);
                                        return (
                                            <div key={i} className={`flex flex-col justify-between p-5 rounded-2xl text-sm font-medium transition duration-500 border ${isSynced ? 'bg-emerald-900/10 border-emerald-500/20 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.1)]' : 'bg-purple-900/20 border-purple-500/10 text-purple-100 hover:bg-purple-900/40 hover:border-purple-500/30 shadow-md'}`}>
                                                <p className="mb-5 leading-relaxed">{act}</p>
                                                <button onClick={() => handleSyncAction(i)} disabled={isSynced} className={`self-start text-xs font-bold px-4 py-2 mt-auto rounded-lg transition-all duration-300 border ${isSynced ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-[#1A243F] hover:bg-indigo-600 text-slate-300 hover:text-white border-white/5 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] tracking-wide'}`}>
                                                    {isSynced ? '✓ Synced to ResOS' : 'Push Action to ResOS'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 font-medium tracking-wide">Click "Run AI Prediction" to generate real-time strategies.</p>
                            )}
                        </div>

                        {/* SMS Marketing Simulator */}
                        {data && (
                            <SMSCampaignCenter actions={data.actions} roomDemand={data.demands.roomDemand} />
                        )}

                    </div>
                </div>

                {/* BOTTOM: Ultimate Presentation Piece */}
                {data && role === 'Admin' && (
                    <div className="bg-gradient-to-br from-[#060913] to-[#0D1528] border border-white/5 p-10 rounded-[40px] mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-indigo-500/20 transition duration-500">

                        {/* Glowing BG effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 blur-[100px] pointer-events-none z-0"></div>

                        <h2 className="text-lg uppercase tracking-[0.2em] font-black text-center mb-12 text-slate-400 relative z-10">
                            Total Impact: Old Strategy vs AI Optimization
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-around gap-10 relative z-10">

                            {/* MANUAL BEFORE */}
                            <div className="text-center w-full md:w-1/3">
                                <div className="inline-block bg-slate-900/80 px-6 py-2 rounded-full border border-slate-700/50 mb-6">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Old Fixed Strategy</p>
                                </div>
                                <p className="text-5xl font-black text-slate-500 tracking-tighter">${beforeTotal.toLocaleString()}</p>
                                <p className="text-sm text-slate-500/70 mt-3 font-medium">Fixed Prices, Unoptimized Demand</p>
                            </div>

                            <div className="w-16 h-16 flex items-center justify-center rounded-3xl bg-slate-800 text-slate-400 border border-slate-700 shrink-0 shadow-inner">
                                <svg className="w-6 h-6 transform md:rotate-0 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </div>

                            {/* AI AFTER */}
                            <div className="text-center w-full md:w-1/3">
                                <div className="inline-block bg-emerald-900/30 px-6 py-2 rounded-full border border-emerald-500/30 mb-6">
                                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Smart AI Strategy</p>
                                </div>
                                <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 drop-shadow-2xl tracking-tighter">
                                    ${data.revenue.totalRevenue.toLocaleString()}
                                </p>
                                <p className="text-sm text-emerald-500 mt-3 font-bold">+${(data.revenue.totalRevenue - beforeTotal).toLocaleString()} Extra Profit Generated</p>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
