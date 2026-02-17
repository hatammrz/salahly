import { Home, Compass, Settings, Calendar } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { isRamadan } from '../utils/hijriUtils';

interface BottomNavProps {
    activeTab: 'home' | 'qibla' | 'fasting' | 'settings';
    onTabChange: (tab: 'home' | 'qibla' | 'fasting' | 'settings') => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
    const { settings } = useSettings();
    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());

    const accentClass = inRamadan ? 'text-[#C6A95E]' : 'text-app-accent';
    const glowBg = inRamadan
        ? 'from-[#C6A95E]/20 to-[#C6A95E]/10'
        : 'from-app-accent/20 to-app-accent-dim/20';

    const tabs = [
        { id: 'home' as const, icon: Home, label: 'Home' },
        { id: 'qibla' as const, icon: Compass, label: 'Qibla' },
        { id: 'fasting' as const, icon: Calendar, label: 'Fasting' },
        { id: 'settings' as const, icon: Settings, label: 'Settings' },
    ];

    return (
        <nav className="fixed bottom-6 left-6 right-6 z-50">
            {/* Glassmorphism floating bar */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-app-card/60 to-app-card/40 rounded-4xl backdrop-blur-glass border border-white/10 shadow-glass" />

                <div className="relative flex justify-around items-center px-2 py-3">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    relative flex flex-col items-center gap-1 py-3 px-4 rounded-2xl transition-all duration-300
                                    ${isActive ? 'scale-110' : 'scale-100 hover:scale-105'}
                                `}
                            >
                                {/* Active indicator glow */}
                                {isActive && (
                                    <div className={`absolute inset-0 bg-gradient-to-r ${glowBg} rounded-2xl backdrop-blur-sm`} />
                                )}

                                <Icon
                                    className={`
                                        relative w-6 h-6 transition-all duration-300
                                        ${isActive ? `${accentClass} drop-shadow-glow` : 'text-app-text-dim'}
                                    `}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span
                                    className={`
                                        relative text-[10px] font-semibold uppercase tracking-wider transition-all duration-300
                                        ${isActive ? accentClass : 'text-app-text-dim'}
                                    `}
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
