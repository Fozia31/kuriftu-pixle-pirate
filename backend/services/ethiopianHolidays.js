import { EthDateTime } from 'ethiopian-calendar-date-converter';

// Ethiopian months:
// 1: Meskerem, 2: Tikimt, 3: Hidar, 4: Tahsas, 5: Tir, 6: Yekatit
// 7: Megabit, 8: Miazia, 9: Ginbot, 10: Sene, 11: Hamle, 12: Nehasse, 13: Pagume

const majorHolidays = {
    "1-1": { name: "Enkutatash (New Year)", intensity: 0.9, type: 'festive' },
    "1-17": { name: "Meskel", intensity: 0.8, type: 'festive' },
    "4-29": { name: "Genna (Christmas)", intensity: 1.0, type: 'family' },
    "5-11": { name: "Timket (Epiphany)", intensity: 0.9, type: 'festive' },
    "6-23": { name: "Adwa Victory Day", intensity: 0.5, type: 'public' },
    "8-27": { name: "Patriots Victory Day", intensity: 0.4, type: 'public' },
    "9-20": { name: "Downfall of the Derg", intensity: 0.3, type: 'public' }
};

// Movable holidays (Gregorian dates for 2024–2026)
const movableHolidays = {
    "2024-5-5": { name: "Fasika (Easter)", intensity: 1.0, type: 'family' },
    "2024-4-10": { name: "Eid al-Fitr", intensity: 0.8, type: 'festive' },
    "2024-6-17": { name: "Eid al-Adha", intensity: 0.8, type: 'festive' },
    "2025-4-20": { name: "Fasika (Easter)", intensity: 1.0, type: 'family' },
    "2025-3-31": { name: "Eid al-Fitr", intensity: 0.8, type: 'festive' },
    "2025-6-7": { name: "Eid al-Adha", intensity: 0.8, type: 'festive' },
    "2026-4-12": { name: "Fasika (Easter)", intensity: 1.0, type: 'family' },
    "2026-3-20": { name: "Eid al-Fitr", intensity: 0.8, type: 'festive' },
    "2026-5-27": { name: "Eid al-Adha", intensity: 0.8, type: 'festive' }
};

export const detectEthiopianHoliday = (gregorianDateString) => {
    try {
        const dateObj = new Date(gregorianDateString);
        if (isNaN(dateObj.getTime())) return { isHoliday: false, name: null, intensity: 0, ethDate: null };

        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const movableKey = `${year}-${month}-${day}`;

        // Convert Gregorian to Ethiopian
        const ethDateTime = EthDateTime.fromEuropeanDate(dateObj);
        const ethDateStr = `${ethDateTime.date} ${['Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehasse', 'Pagume'][ethDateTime.month - 1]} ${ethDateTime.year}`;

        // Check immovable
        const immovableKey = `${ethDateTime.month}-${ethDateTime.date}`;
        if (majorHolidays[immovableKey]) {
            return { isHoliday: true, ...majorHolidays[immovableKey], ethDate: ethDateStr };
        }

        // Check movable
        if (movableHolidays[movableKey]) {
            return { isHoliday: true, ...movableHolidays[movableKey], ethDate: ethDateStr };
        }

        return { isHoliday: false, name: null, intensity: 0, ethDate: ethDateStr, type: null };
    } catch (error) {
        console.error("Ethiopian Calendar Conversion Error:", error);
        return { isHoliday: false, name: null, intensity: 0, ethDate: null };
    }
};
