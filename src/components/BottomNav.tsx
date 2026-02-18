import { Home, Compass, Settings, Calendar, User } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { isRamadan } from '../utils/hijriUtils';

type Tab = 'home' | 'qibla' | 'fasting' | 'settings' | 'account';

interface BottomNavProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
    const { settings } = useSettings();
    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());

    const accentColor = inRamadan ? 'var(--ramadan)' : 'var(--accent)';

    const tabs: { id: Tab; icon: React.ElementType; label: string }[] = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'qibla', icon: Compass, label: 'Qibla' },
        { id: 'fasting', icon: Calendar, label: 'Fasting' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'account', icon: User, label: 'Account' },
    ];

    return (
        <nav className="fixed bottom-6 left-4 right-4 z-50">
            <div className="relative">
                {/* Nav bar background */}
                <div
                    className="absolute inset-0 rounded-4xl backdrop-blur-glass"
                    style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow)',
                        opacity: 0.92,
                    }}
                />

                <div className="relative flex justify-around items-center px-1 py-3">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300
                                    ${isActive ? 'scale-110' : 'scale-100 hover:scale-105'}
                                `}
                            >
                                {/* Active glow pill */}
                                {isActive && (
                                    <div
                                        className="absolute inset-0 rounded-2xl"
                                        style={{ background: `${accentColor}18` }}
                                    />
                                )}

                                <Icon
                                    className="relative w-5 h-5 transition-all duration-300"
                                    style={{ color: isActive ? accentColor : 'var(--text-dim)' }}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span
                                    className="relative text-[9px] font-semibold uppercase tracking-wider transition-all duration-300"
                                    style={{ color: isActive ? accentColor : 'var(--text-dim)' }}
                                >
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
