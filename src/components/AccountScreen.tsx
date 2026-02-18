import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { User, LogOut, Cloud, Mail, Heart } from 'lucide-react';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

interface AccountScreenProps {
    onNavigateToDonate?: () => void;
}

export const AccountScreen = ({ onNavigateToDonate }: AccountScreenProps) => {
    const { user, logout } = useAuth();
    const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

    if (authModal === 'login') {
        return (
            <Login
                onSwitchToRegister={() => setAuthModal('register')}
                onClose={() => setAuthModal(null)}
            />
        );
    }

    if (authModal === 'register') {
        return (
            <Register
                onSwitchToLogin={() => setAuthModal('login')}
                onClose={() => setAuthModal(null)}
            />
        );
    }

    return (
        <div className="h-full overflow-y-auto pb-28 px-6 py-8">
            <div className="mb-8">
                <h2 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Account</h2>
                <p className="text-sm font-light" style={{ color: 'var(--text-dim)' }}>
                    {user ? 'Your Salahly account' : 'Sign in to save your journey'}
                </p>
            </div>

            {user ? (
                <div className="space-y-4">
                    {/* Profile card */}
                    <div className="relative overflow-hidden">
                        <div
                            className="absolute inset-0 rounded-3xl"
                            style={{ background: 'var(--card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }}
                        />
                        <div className="relative px-6 py-6 flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                style={{ background: 'rgba(var(--accent-rgb,52,211,153),0.1)' }}
                            >
                                <User className="w-6 h-6" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{user.email}</p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                                    Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sync status */}
                    <div className="relative overflow-hidden">
                        <div
                            className="absolute inset-0 rounded-3xl"
                            style={{ background: 'var(--card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }}
                        />
                        <div className="relative px-6 py-5 flex items-center gap-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'rgba(var(--accent-rgb,52,211,153),0.1)' }}
                            >
                                <Cloud className="w-5 h-5" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Cloud Sync</p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>Local Mode – data saved on this device</p>
                            </div>
                            <div className="ml-auto">
                                <span
                                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-lg"
                                    style={{ color: 'var(--accent)', background: 'rgba(var(--accent-rgb,52,211,153),0.1)' }}
                                >
                                    Local
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Support Us */}
                    {onNavigateToDonate && (
                        <button onClick={onNavigateToDonate} className="w-full relative overflow-hidden group">
                            <div
                                className="absolute inset-0 rounded-3xl transition-colors"
                                style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)' }}
                            />
                            <div className="relative px-6 py-5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-pink-400" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <span className="font-semibold text-pink-400 text-sm">Support Salahly</span>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>50% goes to helping Muslims worldwide</p>
                                </div>
                            </div>
                        </button>
                    )}

                    {/* Logout */}
                    <button onClick={logout} className="w-full relative overflow-hidden group">
                        <div
                            className="absolute inset-0 rounded-3xl transition-colors"
                            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
                        />
                        <div className="relative px-6 py-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <LogOut className="w-5 h-5 text-red-400" strokeWidth={1.5} />
                            </div>
                            <span className="font-semibold text-red-400 text-sm">Sign Out</span>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Info card */}
                    <div className="relative overflow-hidden">
                        <div
                            className="absolute inset-0 rounded-3xl"
                            style={{ background: 'var(--card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }}
                        />
                        <div className="relative px-6 py-6 space-y-3">
                            <div className="flex justify-center mb-2">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                    style={{ background: 'rgba(var(--accent-rgb,52,211,153),0.1)' }}
                                >
                                    <User className="w-7 h-7" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                                </div>
                            </div>
                            <p className="text-center font-semibold" style={{ color: 'var(--text)' }}>Save your journey</p>
                            <p className="text-center text-sm font-light leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                                Create an account to keep your fasting records, intentions, and settings safe across sessions.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setAuthModal('register')}
                        className="w-full font-semibold py-4 rounded-2xl text-sm transition-opacity"
                        style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                        Create Account
                    </button>

                    <button onClick={() => setAuthModal('login')} className="w-full relative overflow-hidden">
                        <div
                            className="absolute inset-0 rounded-2xl"
                            style={{ background: 'var(--card)', border: '1px solid var(--border-card)' }}
                        />
                        <div className="relative flex items-center justify-center gap-2 py-4">
                            <Mail className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Sign In</span>
                        </div>
                    </button>

                    {/* Support Us (guest) */}
                    {onNavigateToDonate && (
                        <button onClick={onNavigateToDonate} className="w-full relative overflow-hidden">
                            <div
                                className="absolute inset-0 rounded-2xl"
                                style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)' }}
                            />
                            <div className="relative flex items-center justify-center gap-2 py-4">
                                <Heart className="w-4 h-4 text-pink-400" />
                                <span className="font-semibold text-sm text-pink-400">Support Salahly</span>
                            </div>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
