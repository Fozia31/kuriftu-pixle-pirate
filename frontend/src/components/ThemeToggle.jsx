import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all duration-300 group"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
            <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
            >
                {theme === 'dark' ? (
                    <Sun className="text-amber-500" size={20} />
                ) : (
                    <Moon className="text-[#C5A059]" size={20} />
                )}
            </motion.div>
        </button>
    );
}
