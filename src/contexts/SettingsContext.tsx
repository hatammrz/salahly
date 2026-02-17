import { createContext, useContext, useState, ReactNode } from 'react';

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

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<AppSettings>(() => {
        const saved = localStorage.getItem('salahly-settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    const [data, setData] = useState<AppData>(() => {
        const saved = localStorage.getItem('salahly-data');
        return saved ? JSON.parse(saved) : defaultData;
    });

    const updateSettings = (updates: Partial<AppSettings>) => {
        setSettings(prev => {
            const newSettings = { ...prev, ...updates };
            localStorage.setItem('salahly-settings', JSON.stringify(newSettings));
            return newSettings;
        });
    };

    const updateData = (updates: Partial<AppData>) => {
        setData(prev => {
            const newData = { ...prev, ...updates };
            localStorage.setItem('salahly-data', JSON.stringify(newData));
            return newData;
        });
    };

    const addFastingDay = (date: string, status: 'fasted' | 'missed' | 'voluntary') => {
        setData(prev => {
            const filtered = prev.fastingDays.filter(d => d.date !== date);
            const newData = {
                ...prev,
                fastingDays: [...filtered, { date, status }]
            };
            localStorage.setItem('salahly-data', JSON.stringify(newData));
            return newData;
        });
    };

    const removeFastingDay = (date: string) => {
        setData(prev => {
            const newData = {
                ...prev,
                fastingDays: prev.fastingDays.filter(d => d.date !== date)
            };
            localStorage.setItem('salahly-data', JSON.stringify(newData));
            return newData;
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
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};
