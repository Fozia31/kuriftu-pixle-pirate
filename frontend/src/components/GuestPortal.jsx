import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AssistantBubble from './AssistantBubble';
import ThemeToggle from './ThemeToggle';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import experienceImage from '../assets/experience.jpg';
import { EXPERIENCES } from '../data/experiences';

import { 
    Hotel, 
    Wind, 
    Palmtree, 
    UtensilsCrossed, 
    Sparkles, 
    Compass, 
    TrendingUp,
    LogOut,
    Sun,
    CloudRain,
    Cloud
} from 'lucide-react';

const iconMap = {
    hotel: Hotel,
    wind: Wind,
    palmtree: Palmtree,
    utensils: UtensilsCrossed,
    compass: Compass
};

export default function GuestPortal() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const firstName = user?.name?.split(' ')[0] || 'Guest';
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({ tempC: 24, category: 'Clear', condition: 'Sunny', city: 'Bishoftu' });
    const [stability, setStability] = useState({ index: 95, status: 'Stable' });
    const [offers, setOffers] = useState([]);
    const [branch, setBranch] = useState('Kuriftu Resort & Spa Bishoftu (Debre Zeit)');
    

    useEffect(() => {
        const fetchContextData = async () => {
            try {
                const res = await apiClient.post('/revenue/total', {
                    date: new Date().toISOString().split('T')[0],
                    baseRoomPrice: 150,
                    baseSpaPrice: 60,
                    baseWaterparkPrice: 30,
                    branch: branch
                });
                
                // Capture Ecosystem Data & Announcements
                if (res.data.liveWeatherDetails) {
                    setWeather({
                        ...res.data.liveWeatherDetails,
                        condition: res.data.liveWeatherDetails.condition || res.data.liveWeatherDetails.rawDescription || 'Optimal'
                    });
                }
                if (res.data.stabilityDetails) setStability(res.data.stabilityDetails);
                if (res.data.activeAnnouncement) {
                    setAnnouncement(res.data.activeAnnouncement);
                } else {
                    setAnnouncement(null);
                }

                const rawActions = res.data.actions || [];
                const guestOffers = rawActions.map(act => {
                    const isRainyMsg = act.includes('Rainy') || act.includes('Indoor');
                    const isSpaMsg = act.includes('Spa') || act.includes('Wellness');
                    
                    if (act.includes('Discount') || act.includes('Off') || isRainyMsg) {
                        return { 
                            title: isRainyMsg ? 'Rainy Day Privilege' : (isSpaMsg ? 'Wellness Special' : 'Exclusive Privilege'), 
                            text: act.replace(/(\$\d+\s➔\s\$\d+)/g, ' Exclusive Rate!'),
                            buttonText: act.includes('%') ? `Claim ${act.match(/\d+%/)[0]} Discount` : 'Claim Privilege'
                        };
                    }
                    return null;
                }).filter(Boolean);

                setOffers(guestOffers.length > 0 ? guestOffers : [{ 
                    title: 'Special Recommendation', 
                    text: 'Visit our Spa for an Ethio-Traditional therapy session today.',
                    buttonText: 'Claim Privilege'
                }]);
            } catch (err) {
                console.error('Failed to fetch personalized offers:', err.response?.data?.error || err.message);
                // Fallback UI State
                setOffers([{ 
                    title: 'Special Recommendation', 
                    text: 'Visit our Spa for an Ethio-Traditional therapy session today.',
                    buttonText: 'Claim Privilege'
                }]);
            } finally {
                setLoading(false);
            }
        };
        fetchContextData();
    }, [branch]);

    useEffect(() => {
        let timeoutId;
        let currentIndex = 0;
        let isDeleting = false;

        const animateName = () => {
            if (!isDeleting) {
                currentIndex += 1;
                setTypedName(firstName.slice(0, currentIndex));

                if (currentIndex === firstName.length) {
                    timeoutId = setTimeout(() => {
                        isDeleting = true;
                        animateName();
                    }, 1200);
                    return;
                }

                timeoutId = setTimeout(animateName, 120);
                return;
            }

            currentIndex -= 1;
            setTypedName(firstName.slice(0, Math.max(currentIndex, 0)));

            if (currentIndex <= 0) {
                isDeleting = false;
                timeoutId = setTimeout(animateName, 350);
                return;
            }

            timeoutId = setTimeout(animateName, 70);
        };

        setTypedName('');
        timeoutId = setTimeout(animateName, 400);

        return () => clearTimeout(timeoutId);
    }, [firstName]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getConciergeMessage = () => {
        if (weather.category === 'Rain' || weather.category === 'Cloud') {
            return `The perfect afternoon for a sanctuary of indoor luxury and spa therapy.`;
        }
        if (stability.status === 'Stable') {
            return `A perfect day for lakeside serenity and peace.`;
        }
        return `The perfect afternoon for a breathtaking lakeside escape.`;
    };
    
    const getWeatherIcon = () => {
        if (weather.category === 'Rain') return <CloudRain className="text-blue-400" size={16} />;
        if (weather.category === 'Cloud') return <Cloud className="text-slate-400" size={16} />;
        return <Sun className="text-amber-400" size={16} />;
    };

    const services = EXPERIENCES.map((service) => {
        const Icon = iconMap[service.iconKey];

        return {
            ...service,
            reasoning: service.id === 'spa'
                ? (weather.category === 'Rain'
                    ? 'Recommended due to rainy weather conditions.'
                    : 'Personalized based on your wellness preference.')
                : null,
            icon: Icon ? <Icon size={20} /> : null
        };
    });

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-500 pb-20 overflow-x-hidden">
            {/* Header / Top Nav */}
            <nav className="p-6 flex items-center justify-between border-b border-[var(--border)] dark:border-white/5 backdrop-blur-xl sticky top-0 z-40 bg-[var(--background)]/80">
                <div className="flex items-center gap-3">
                    <div className="bg-[#C5A059] w-8 h-8 rounded-lg shadow-lg"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059]">Guest Experience</span>
                </div>
                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    <div className="flex items-center gap-4 pl-6 border-l border-[var(--border)] dark:border-white/5">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-xs font-bold leading-none mb-1 flex items-center justify-end gap-2">
                                {getWeatherIcon()}
                                {weather.condition}
                            </span>
                            <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">{stability.status} Sanctuary</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-black text-xs shadow-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-3 bg-stone-100 dark:bg-white/5 rounded-full hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 mt-20">
                {/* Greeting */}
                <div className="mb-16">
                    {/* <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059] mb-4 block">Personalized Sanctuary</span> */}
                    <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tight leading-tight transition-all duration-700">
                        Welcome back{' '}
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#D4AF37]">
                            {typedName}
                            <span className="animate-pulse">|</span>
                        </span>
                    </h1>
                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 text-slate-500 font-medium tracking-wide animate-fade-in transition-all duration-1000">
                        <div className="flex items-center gap-3 bg-stone-100 dark:bg-white/5 border border-[var(--border)] dark:border-white/10 px-4 py-2 rounded-full whitespace-nowrap">
                            {getWeatherIcon()}
                            <span className="text-xs font-bold text-[var(--foreground)]">{weather.tempC}°C</span>
                            <span className="text-slate-400">in</span>
                            <select 
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs font-black text-[#C5A059] uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity appearance-none pr-1"
                            >
                                <option value="Kuriftu Resort & Spa Bishoftu (Debre Zeit)">Bishoftu</option>
                                <option value="Kuriftu Resort & Spa Bahir Dar">Bahir Dar</option>
                                <option value="Kuriftu Resort & Spa Entoto">Entoto</option>
                                <option value="Kuriftu Water Park">Water Park</option>
                                <option value="Kuriftu African Village (Bishoftu)">African Village</option>
                            </select>
                        </div>
                        <p className="sm:border-l sm:border-[var(--border)] dark:sm:border-white/10 sm:pl-4">
                            {loading ? 'Initializing Concierge...' : getConciergeMessage()}
                        </p>
                    </div>
                </div>

                {/* Dynamic Banner - Flash Offers (Glassmorphic) */}
                {!loading && (announcement || (offers && offers.length > 0)) && (
                    <div className="mb-24 relative p-1 rounded-[40px] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] animate-fade-in shadow-2xl shadow-amber-500/10">
                        <div className="bg-[var(--background)]/90 dark:bg-[#1A1D23]/90 backdrop-blur-3xl rounded-[38px] p-10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative border border-white/5">
                            <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-[#C5A059]/10 blur-[120px] rounded-full pointer-events-none translate-y-12"></div>
                            <div className="flex items-center gap-8 relative z-10 w-full">
                                <div className={`p-5 rounded-3xl border shadow-xl transition-all duration-700 ${announcement ? 'bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10' : 'bg-[#C5A059]/10 border-[#C5A059]/20 shadow-amber-500/10'}`}>
                                    <Sparkles className={announcement ? 'text-indigo-500' : 'text-[#C5A059]'} size={36} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${announcement ? 'text-indigo-500' : 'text-[#C5A059]'}`}>
                                            {announcement ? 'Live Resort Privilege' : (offers[0]?.title || 'Special Recommendation')}
                                        </h3>
                                        {announcement && (
                                            <span className="flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xl md:text-2xl font-serif font-bold leading-relaxed max-w-2xl transition-all duration-700">
                                        {announcement || offers[0]?.text || 'Loading exclusive recommendations...'}
                                    </p>
                                </div>
                            </div>
                            {/* <button className={`text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all duration-500 active:scale-95 relative z-10 whitespace-nowrap ${announcement ? 'bg-indigo-600 hover:shadow-indigo-500/30' : 'bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:shadow-amber-500/30'}`}>
                                {announcement ? 'Claim Live Offer' : (offers[0]?.buttonText || 'Claim Privilege')}
                            </button> */}
                        </div>
                    </div>
                )}

                {/* Service Grid Section Heading */}
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-serif font-black tracking-tight mb-2">Curated Experiences</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hand-selected for your itinerary</p>
                    </div>
                </div>

                {/* Service Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {services.map((svc) => (
                        <div key={svc.id} className="group relative bg-[var(--card)] border border-[var(--border)] dark:border-white/5 rounded-[40px] hover:shadow-2xl hover:shadow-[#C5A059]/5 transition-all duration-700 overflow-hidden hover:-translate-y-3">
                            {/* Image Container */}
                            <div className="aspect-[16/9] overflow-hidden relative">
                                <img 
                                    src={svc.image} 
                                    alt={svc.name} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/20 to-transparent"></div>
                                
                                {/* AI/Premium Badge */}
                                <div className="absolute top-6 right-6">
                                    <div className={`px-5 py-2.5 rounded-xl border font-black text-[9px] uppercase tracking-widest flex items-center gap-2 backdrop-blur-xl transition-all duration-500 ${svc.special ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500 ai-glow animate-pulse-subtle' : 'bg-stone-900/40 border-white/10 text-white'}`}>
                                        {svc.special && <Sparkles size={10} />}
                                        {svc.tag}
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-10 relative">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${svc.special ? 'bg-indigo-500/10 text-indigo-500' : 'bg-[#C5A059]/10 text-[#C5A059]'}`}>
                                        {svc.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em] mb-1">{svc.subtitle}</h3>
                                        <h2 className="text-2xl font-serif font-black">{svc.name}</h2>
                                    </div>
                                </div>

                                {svc.reasoning && (
                                    <p className="text-[9px] font-bold text-indigo-500/80 uppercase tracking-widest mb-6 italic transition-all duration-700">
                                        ✧ {svc.reasoning}
                                    </p>
                                )}

                                <p className="text-slate-500 font-medium leading-relaxed mb-10 text-sm">
                                    {svc.desc}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-[var(--border)] dark:border-white/5">
                                    <button
                                        onClick={() => navigate(`/experience/${svc.id}`)}
                                        className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:tracking-[0.3em] transition-all flex items-center gap-3"
                                    >
                                        Explore Details <Compass size={14} className="group-hover:rotate-45 transition-transform duration-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recommendation Highlight (Glassmorphic) */}
                <div className="mt-32 relative p-1 rounded-[56px] border border-[var(--border)] dark:border-white/5 bg-[var(--card)] overflow-hidden">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#C5A059]/5 to-transparent"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 p-12">
                        <div className="w-56 h-72 sm:w-80 sm:h-96 shrink-0 rounded-[44px] overflow-hidden border border-[var(--border)] shadow-2xl relative group">
                            <img 
                                src={experienceImage}
                                alt="Experience" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                            />
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                                <TrendingUp size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Intelligent Reservation</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-serif font-black mb-8 leading-snug">
                                {weather.category === 'Rain' ? 'The Art of Indoor Sanctuary.' : 'Designed for your absolute stillness.'}
                            </h2>
                            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-2xl mb-12">
                                {weather.category === 'Rain' 
                                    ? `It's a beautiful rainy day in Bishoftu. We've optimized your itinerary for the ultimate indoor luxury experience.` 
                                    : 'Based on local weather forecasts and your interest in wellness, we have optimized your itinerary for private lakeside therapy sessions.'}
                            </p>
                            <button className="bg-[var(--foreground)] text-[var(--background)] px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all duration-500 shadow-xl active:scale-95">
                                My Full Itinerary
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Assistant Bubble Context */}
            <AssistantBubble dashboardContext={{ 
                userName: user?.name, 
                role: 'GUEST',
                preferences: user?.preferences || [],
                theme: theme,
                weather: weather,
                stability: stability
            }} />
        </div>
    );
}
