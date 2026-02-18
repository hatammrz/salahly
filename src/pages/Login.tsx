import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Moon } from 'lucide-react';

interface LoginProps {
    onSwitchToRegister: () => void;
    onClose: () => void;
}

export const Login = ({ onSwitchToRegister, onClose }: LoginProps) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
            <div className="w-full max-w-sm relative">
                {/* Card */}
                <div className="relative overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0F1A2E] to-[#0B1220] border border-white/10" />
                    <div className="relative px-8 py-10 space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-app-accent/10 flex items-center justify-center">
                                    <Moon className="w-6 h-6 text-app-accent" strokeWidth={1.5} />
                                </div>
                            </div>
                            <h2 className="font-display text-2xl font-bold text-app-text">Welcome back</h2>
                            <p className="text-app-text-dim text-sm">Sign in to your Qamar account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-dim" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-app-text placeholder-app-text-dim/50 text-sm focus:outline-none focus:border-app-accent/50 transition-colors"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-dim" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-11 py-3.5 text-app-text placeholder-app-text-dim/50 text-sm focus:outline-none focus:border-app-accent/50 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-dim"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-red-400 text-xs text-center">{error}</p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-app-accent text-black font-semibold py-3.5 rounded-2xl text-sm transition-opacity disabled:opacity-50"
                            >
                                {loading ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="text-center space-y-3">
                            <p className="text-app-text-dim text-xs">
                                Don't have an account?{' '}
                                <button
                                    onClick={onSwitchToRegister}
                                    className="text-app-accent font-semibold"
                                >
                                    Create one
                                </button>
                            </p>
                            <button
                                onClick={onClose}
                                className="text-app-text-dim/50 text-xs"
                            >
                                Continue without account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
