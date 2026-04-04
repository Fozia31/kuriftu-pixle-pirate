import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader2, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/client';

export default function SMSCampaignCenter({ actions, roomDemand }) {
    const { theme } = useTheme();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success
    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

    const checkedInGuests = roomDemand ? Math.floor(roomDemand * 1.5) : 0;

    const fetchAnnouncements = async () => {
        try {
            const res = await apiClient.get('/revenue/announcements');
            setAnnouncements(res.data);
            setLoadingAnnouncements(false);
        } catch (err) {
            console.error('Failed to fetch announcements');
            setLoadingAnnouncements(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        if (actions && actions.length > 0) {
            const promoAction = actions.find(a => a.toLowerCase().includes('sms') || a.toLowerCase().includes('discount') || a.toLowerCase().includes('promotion'));
            if (promoAction) {
                if (promoAction.includes('Spa')) {
                    setMessage("KURIFTU EXCLUSIVE: High occupancy today! Escape the crowd with 30% off Spa Walk-in rates for the next 2 hours. Reply YES to book.");
                } else if (promoAction.includes('Room')) {
                    setMessage("KURIFTU FLASH: Secure an extended weekend stay right now at 20% off standard rates. First 10 replies unlock the bundle!");
                } else {
                    setMessage(`KURIFTU RESORT: ${promoAction.substring(0, 80)}... Reply to claim!`);
                }
            } else {
                setMessage("KURIFTU RESORT: Thank you for staying with us! Visit the front desk for our premium daily excursions and bundles.");
            }
        }
        setStatus('idle');
    }, [actions]);

    const handleBroadcast = async () => {
        if (status !== 'idle' || !message.trim()) return;
        setStatus('sending');
        try {
            await apiClient.post('/revenue/announcement', { message });
            setStatus('success');
            fetchAnnouncements();
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            console.error('Failed to broadcast announcement');
            setStatus('idle');
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/revenue/announcement/${id}`);
            fetchAnnouncements();
        } catch (err) {
            console.error('Failed to delete announcement');
        }
    };

    if (!roomDemand) return null;

    return (
        <div className="bg-[var(--card)] p-10 rounded-[48px] border border-[var(--border)] dark:border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-700">
            {/* Background Glow */}
            <div className="absolute top-0 right-[-10%] w-[40%] h-full bg-[#C5A059]/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50"></div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="bg-[#C5A059]/10 p-4 rounded-2xl border border-[#C5A059]/20 shadow-sm">
                    <MessageSquare size={24} className="text-[#C5A059]" />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-black tracking-tight leading-none mb-2">Live Marketing</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Cross-Service SMS Pipeline</p>
                </div>
            </div>

            <div className="space-y-8 relative z-10">
                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4 px-1">Campaign Broadcast Payload</label>
                    <textarea
                        className="w-full bg-stone-50 dark:bg-black/20 border border-[var(--border)] dark:border-white/5 rounded-3xl p-6 text-sm font-medium focus:outline-none focus:border-[#C5A059]/40 transition-all placeholder:text-slate-700/30 resize-none shadow-inner leading-relaxed"
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type promotional SMS..."
                    ></textarea>
                </div>

                <div className="flex items-center justify-between px-1">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 px-5 py-2.5 rounded-xl flex items-center gap-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Target: {checkedInGuests} Physical Guests On-Property</span>
                    </div>
                </div>

                <button
                    onClick={handleBroadcast}
                    disabled={status !== 'idle' || checkedInGuests === 0}
                    className={`btn-gold w-full flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest ${status === 'success' ? 'bg-emerald-600 from-emerald-600 to-emerald-600' : ''}`}
                >
                    {status === 'idle' && (
                        <>
                            <Send size={18} className="transition-transform group-hover:translate-x-1" />
                            Broadcast SMS Campaign
                        </>
                    )}
                    {status === 'sending' && (
                        <>
                            <Loader2 size={18} className="animate-spin text-white" />
                            Routing to Gateway...
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <CheckCircle size={18} />
                            Sent via EthioTelecom
                        </>
                    )}
                </button>

                {status === 'success' && (
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black text-emerald-500 text-center uppercase tracking-widest mt-4"
                    >
                        ✓ Campaign successfully broadcasted to {checkedInGuests} guests.
                    </motion.p>
                )}

                {/* Active Announcements List */}
                <div className="mt-12 pt-12 border-t border-[var(--border)] dark:border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-serif font-black tracking-tight leading-none mb-2">Active Broadcasts</h3>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Management of live on-property offers</p>
                        </div>
                        <span className="text-[9px] font-black bg-[#C5A059]/10 text-[#C5A059] px-3 py-1 rounded-full uppercase tracking-widest">
                            {announcements.length} Active
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                        <AnimatePresence>
                            {announcements.length > 0 ? (
                                announcements.map((ann, idx) => (
                                    <motion.div 
                                        key={ann._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="p-5 rounded-3xl bg-stone-50 dark:bg-white/5 border border-[var(--border)] dark:border-white/5 group/item hover:border-[#C5A059]/20 transition-all flex flex-col gap-4"
                                    >
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                            "{ann.message}"
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                Created {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <button 
                                                onClick={() => handleDelete(ann._id)}
                                                className="bg-rose-500/10 text-rose-500 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                            >
                                                Remove Offer
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-10 text-center bg-stone-50/50 dark:bg-white/5 rounded-3xl border border-dashed border-[var(--border)] dark:border-white/5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active marketing broadcasts found.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
