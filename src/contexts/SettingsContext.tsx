import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FastingDay {
    date: string; // YYYY-MM-DD
    status: 'fasted' | 'missed' | 'voluntary';
}

interface AppSettings {
    timeFormat: '12' | '24';
    showSunrise: boolean;
    backgroundMode: 'static' | 'animated' | 'oled';
    ramadanMode: 'auto' | 'on' | 'off';
    showDailyIntention: boolean;
}

interface AppData {
    fastingDays: FastingDay[];
    dailyIntention: string;
}

interface SettingsContextType {
    settings: AppSettings;
    data: AppData;
    updateSettings: (updates: Partial<AppSettings>) => void;
    updateData: (updates: Partial<AppData>) => void;
    addFastingDay: (date: string, status: 'fasted' | 'missed' | 'voluntary') => void;
    removeFastingDay: (date: string) => void;
}

const defaultSettings: AppSettings = {
    timeFormat: '12',
    showSunrise: true,
    backgroundMode: 'static',
    ramadanMode: 'auto',
    showDailyIntention: false,
};

const defaultData: AppData = {
    fastingDays: [],
    dailyIntention: '',
};

// ─── Storage key helpers ──────────────────────────────────────────────────────
// Settings are global (not per-user). Data is per-user.
const SETTINGS_KEY = 'qamar_settings';
const dataKey = (userId: string | null) =>
    userId ? `qamar_data_${userId}` : 'qamar_data_guest';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: ReactNode;
    userId: string | null; // Pass from AuthContext
}

export const SettingsProvider = ({ children, userId }: SettingsProviderProps) => {
    const [settings, setSettings] = useState<AppSettings>(() => {
        const saved = localStorage.getItem(SETTINGS_KEY);
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    });

    const [data, setData] = useState<AppData>(() => {
        const key = dataKey(userId);
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultData;
    });

    // When userId changes (login / logout), reload the correct data bucket
    useEffect(() => {
        const key = dataKey(userId);
        const saved = localStorage.getItem(key);
        setData(saved ? JSON.parse(saved) : defaultData);
    }, [userId]);

    const updateSettings = (updates: Partial<AppSettings>) => {
        setSettings(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
            return next;
        });
    };

    const updateData = (updates: Partial<AppData>) => {
        setData(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem(dataKey(userId), JSON.stringify(next));
            return next;
        });
    };

    const addFastingDay = (date: string, status: 'fasted' | 'missed' | 'voluntary') => {
        setData(prev => {
            const filtered = prev.fastingDays.filter(d => d.date !== date);
            const next = { ...prev, fastingDays: [...filtered, { date, status }] };
            localStorage.setItem(dataKey(userId), JSON.stringify(next));
            return next;
        });
    };

    const removeFastingDay = (date: string) => {
        setData(prev => {
            const next = { ...prev, fastingDays: prev.fastingDays.filter(d => d.date !== date) };
            localStorage.setItem(dataKey(userId), JSON.stringify(next));
            return next;
        });
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            data,
            updateSettings,
            updateData,
            addFastingDay,
            removeFastingDay
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
};
