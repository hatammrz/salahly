import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QamarUser, registerUser, loginUser, logoutUser, getStoredUser } from '../services/auth';

interface AuthContextType {
    user: QamarUser | null;
    loading: boolean;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<QamarUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const stored = getStoredUser();
        setUser(stored);
        setLoading(false);
    }, []);

    const register = async (email: string, password: string) => {
        const newUser = await registerUser(email, password);
        setUser(newUser);
    };

    const login = async (email: string, password: string) => {
        const loggedIn = await loginUser(email, password);
        setUser(loggedIn);
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
