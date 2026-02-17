import HijriDate from 'hijri-date';

export interface HijriDateInfo {
    day: number;
    month: number;
    year: number;
    monthName: string;
    formatted: string;
}

const hijriMonthNames = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
    'Ramadan', 'Shawwal', 'Dhul-Qadah', 'Dhul-Hijjah'
];

export const getHijriDate = (gregorianDate: Date = new Date()): HijriDateInfo => {
    const hijri = new HijriDate(gregorianDate);

    return {
        day: hijri.getDate(),
        month: hijri.getMonth() + 1, // HijriDate returns 0-indexed month
        year: hijri.getFullYear(),
        monthName: hijriMonthNames[hijri.getMonth()],
        formatted: `${hijri.getDate()} ${hijriMonthNames[hijri.getMonth()]} ${hijri.getFullYear()} AH`
    };
};

export const isRamadan = (gregorianDate: Date = new Date()): boolean => {
    const hijri = getHijriDate(gregorianDate);
    return hijri.month === 9; // Ramadan is the 9th month
};

export const getRamadanDaysRemaining = (gregorianDate: Date = new Date()): number | null => {
    const hijri = getHijriDate(gregorianDate);
    if (hijri.month !== 9) return null;

    // Ramadan is typically 29 or 30 days
    return 30 - hijri.day;
};

export const getNextRamadanDate = (gregorianDate: Date = new Date()): Date => {
    // Approximate: This is a simplified version
    // In production, you'd use a proper Islamic calendar library with astronomical calculations
    const currentHijri = getHijriDate(gregorianDate);

    let targetYear = currentHijri.year;
    if (currentHijri.month >= 9) {
        targetYear++; // Next Ramadan is next Hijri year
    }

    // Approximate calculation: Create a date for 1st Ramadan of target year
    // Note: This is simplified. Real implementation would need precise conversion
    const approximateDaysToAdd = ((targetYear - currentHijri.year) * 354) +
        ((9 - currentHijri.month) * 29.5);

    const nextRamadan = new Date(gregorianDate);
    nextRamadan.setDate(nextRamadan.getDate() + Math.floor(approximateDaysToAdd));

    return nextRamadan;
};
