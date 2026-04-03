import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader2, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SMSCampaignCenter({ actions, roomDemand }) {
    const { theme } = useTheme();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success

    // Simulate Guest count (Assume 1.5 guests per occupied capacity unit on a 100 room system)
    const checkedInGuests = roomDemand ? Math.floor(roomDemand * 1.5) : 0;

    useEffect(() => {
        if (actions && actions.length > 0) {
            const promoAction = actions.find(a => a.toLowerCase().includes('sms') || a.toLowerCase().includes('discount') || a.toLowerCase().includes('promotion'));
            if (promoAction) {
                // Auto-fill template based on context
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

    const handleBroadcast = () => {
        if (status !== 'idle') return;
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 5000);
        }, 2000);
    };

    if (!roomDemand) return null;

    return (
        <div className="bg-white dark:bg-gradient-to-br dark:from-[#120F0D] dark:to-[#261E14] p-6 rounded-[24px] border border-gray-100 dark:border-amber-500/20 shadow-xl dark:shadow-2xl relative overflow-hidden group transition-all duration-500">
            {/* Background Glow */}
            <div className="absolute top-0 right-[-10%] w-48 h-48 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="bg-gold-500/10 dark:bg-amber-500/30 p-2.5 rounded-xl border border-gold-500/20 dark:border-amber-500/30 shadow-sm">
                    <MessageSquare size={20} className="text-gold-600 dark:text-amber-400" />
                </div>
                <div>
                    <h2 className="text-lg font-serif font-black text-gray-900 dark:text-amber-50 tracking-wide">Live Marketing</h2>
                    <p className="text-xs font-bold text-gold-600 dark:text-amber-500/70 tracking-widest uppercase">Cross-Service SMS Pipeline</p>
                </div>
            </div>

            <div className="space-y-5 relative z-10">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-widest block mb-2">Campaign Broadcast Payload</label>
                    <textarea
                        className="w-full bg-gray-50 dark:bg-[#060913]/80 border border-gray-200 dark:border-white/5 rounded-xl p-4 text-sm font-medium text-gray-900 dark:text-amber-50 focus:outline-none focus:border-gold-500/50 dark:focus:border-amber-500/50 focus:bg-white dark:focus:bg-[#0A0E1A] transition-colors placeholder:text-gray-400 dark:placeholder:text-slate-600 resize-none shadow-sm leading-relaxed"
                        rows="3"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type promotional SMS..."
                    ></textarea>
                </div>

                <div className="flex items-center justify-between">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">Target: {checkedInGuests} Guests currently on property</span>
                    </div>
                </div>

                <button
                    onClick={handleBroadcast}
                    disabled={status !== 'idle' || checkedInGuests === 0}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold tracking-wide transition-all duration-500 shadow-xl border ${status === 'success'
                            ? 'bg-emerald-600/90 border-emerald-500 text-white shadow-[0_0_30px_rgba(52,211,153,0.3)]'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#060913] border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:grayscale'
                        }`}
                >
                    {status === 'idle' && (
                        <>
                            <Send size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                            Broadcast SMS Campaign
                        </>
                    )}
                    {status === 'sending' && (
                        <>
                            <Loader2 size={18} className="animate-spin text-[#060913]" />
                            Routing to EthioTelecom...
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <CheckCircle size={18} />
                            Sent via EthioTelecom Gateway
                        </>
                    )}
                </button>

                {status === 'success' && (
                    <div className="text-center mt-2 pb-2">
                        <p className="text-xs font-black text-emerald-400 tracking-wide">✓ Campaign Broadcasted! SMS sent to {checkedInGuests} guests via EthioTelecom Gateway (Simulated).</p>
                    </div>
                )}
            </div>
        </div>
    );
}
