import { EthDateTime } from 'ethiopian-calendar-date-converter';

// Ethiopian months:
// 1: Meskerem, 2: Tikimt, 3: Hidar, 4: Tahsas, 5: Tir, 6: Yekatit
// 7: Megabit, 8: Miazia, 9: Ginbot, 10: Sene, 11: Hamle, 12: Nehasse, 13: Pagume

const majorHolidays = {
    "1-1": "Enkutatash (New Year)",
    "1-17": "Meskel",
    "4-29": "Genna (Christmas)",
    "5-11": "Timket (Epiphany)",
    "6-23": "Adwa Victory Day",
    "8-27": "Patriots Victory Day",
    "9-20": "Downfall of the Derg"
};

export const detectEthiopianHoliday = (gregorianDateString) => {
    try {
        const dateObj = new Date(gregorianDateString);
        if (isNaN(dateObj.getTime())) return { isHoliday: false, name: null };

        // Convert the standard JS Date to Ethiopian Date
        const ethDate = EthDateTime.fromEuropeanDate(dateObj);

        const key = `${ethDate.month}-${ethDate.date}`;

        if (majorHolidays[key]) {
            return { isHoliday: true, name: majorHolidays[key] };
        }

        return { isHoliday: false, name: null };
    } catch (error) {
        console.error("Ethiopian Calendar Conversion Error:", error);
        return { isHoliday: false, name: null };
    }
};
