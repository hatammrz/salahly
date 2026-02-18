import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light' | 'auto';

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (t: ThemeMode) => void;
    /** The resolved theme actually applied (never 'auto') */
    resolved: 'dark' | 'light';
}

const STORAGE_KEY = 'qamar_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemPreference(): 'dark' | 'light' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'dark' | 'light') {
    if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
        return stored ?? 'dark';
    });

    const resolved: 'dark' | 'light' =
        theme === 'auto' ? getSystemPreference() : theme;

    // Apply on mount and whenever theme changes
    useEffect(() => {
        const r = theme === 'auto' ? getSystemPreference() : theme;
        applyTheme(r);
    }, [theme]);

    // Listen for system preference changes when in 'auto' mode
    useEffect(() => {
        if (theme !== 'auto') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    const setTheme = (t: ThemeMode) => {
        localStorage.setItem(STORAGE_KEY, t);
        setThemeState(t);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};
