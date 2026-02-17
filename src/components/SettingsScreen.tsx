import { useSettings } from '../contexts/SettingsContext';
import { isRamadan } from '../utils/hijriUtils';
import { Clock, Eye, EyeOff, Moon, Heart, Sun } from 'lucide-react';

export const SettingsScreen = () => {
    const { settings, updateSettings } = useSettings();
    const currentlyInRamadan = isRamadan();
    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && currentlyInRamadan);
    const accentColor = inRamadan ? '#C6A95E' : '#34D399';

    const settingsSections = [
        {
            title: 'Display',
            items: [
                {
                    icon: Clock,
                    label: 'Time Format',
                    value: settings.timeFormat === '12' ? '12-hour' : '24-hour',
                    action: () => updateSettings({ timeFormat: settings.timeFormat === '12' ? '24' : '12' })
                },
                {
                    icon: settings.showSunrise ? Eye : EyeOff,
                    label: 'Show Sunrise',
                    value: settings.showSunrise ? 'Visible' : 'Hidden',
                    action: () => updateSettings({ showSunrise: !settings.showSunrise })
                }
            ]
        },
        {
            title: 'Ramadan Mode',
            subtitle: currentlyInRamadan ? '🌙 Currently Ramadan' : '',
            items: [
                {
                    icon: Sun,
                    label: 'Ramadan Theme',
                    value: settings.ramadanMode === 'auto' ? 'Auto' :
                        settings.ramadanMode === 'on' ? 'Always On' : 'Off',
                    action: () => {
                        const modes: Array<'auto' | 'on' | 'off'> = ['auto', 'on', 'off'];
                        const currentIndex = modes.indexOf(settings.ramadanMode);
                        const nextMode = modes[(currentIndex + 1) % modes.length];
                        updateSettings({ ramadanMode: nextMode });
                    }
                }
            ]
        },
        {
            title: 'Reflection',
            items: [
                {
                    icon: Heart,
                    label: 'Daily Intention',
                    value: settings.showDailyIntention ? 'Shown' : 'Hidden',
                    action: () => updateSettings({ showDailyIntention: !settings.showDailyIntention })
                }
            ]
        },
        {
            title: 'Background',
            items: [
                {
                    icon: Moon,
                    label: 'Background Mode',
                    value: settings.backgroundMode === 'static' ? 'Static' :
                        settings.backgroundMode === 'animated' ? 'Animated' : 'OLED',
                    action: () => {
                        const modes: Array<'static' | 'animated' | 'oled'> = ['static', 'animated', 'oled'];
                        const currentIndex = modes.indexOf(settings.backgroundMode);
                        const nextMode = modes[(currentIndex + 1) % modes.length];
                        updateSettings({ backgroundMode: nextMode });
                    }
                }
            ]
        }
    ];

    return (
        <div className="h-full overflow-y-auto pb-28 px-6 py-8">
            <div className="mb-8">
                <h2 className="font-display text-3xl font-bold text-app-text mb-2">
                    Settings
                </h2>
                <p className="text-app-text-dim text-sm font-light">
                    Customize your prayer companion
                </p>
            </div>

            <div className="space-y-6">
                {settingsSections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="space-y-3">
                        <h3 className="font-display text-xs uppercase tracking-widest text-app-text-dim font-semibold mb-4 flex items-center gap-2">
                            {section.title}
                            {section.subtitle && (
                                <span className="text-[#C6A95E] normal-case text-[10px]">{section.subtitle}</span>
                            )}
                        </h3>
                        {section.items.map((item, itemIdx) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={itemIdx}
                                    onClick={item.action}
                                    className="w-full group relative overflow-hidden"
                                >
                                    {/* Glassmorphism card */}
                                    <div
                                        className="absolute inset-0 rounded-3xl backdrop-blur-glass bg-gradient-to-br from-app-card/40 to-app-card/20 border border-white/5 transition-all duration-300"
                                        style={{ '--hover-border': `${accentColor}4D` } as React.CSSProperties}
                                    />

                                    {/* Hover glow */}
                                    <div
                                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: `linear-gradient(to right, ${accentColor}0D, transparent)` }}
                                    />

                                    <div className="relative px-6 py-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                                                style={{ backgroundColor: `${accentColor}1A` }}
                                            >
                                                <Icon className="w-5 h-5" style={{ color: accentColor }} strokeWidth={2} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-app-text text-sm">
                                                    {item.label}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="px-4 py-1.5 rounded-xl border"
                                            style={{
                                                backgroundColor: `${accentColor}1A`,
                                                borderColor: `${accentColor}33`
                                            }}
                                        >
                                            <span className="text-sm font-semibold" style={{ color: accentColor }}>
                                                {item.value}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ))}

                {/* About section */}
                <div className="mt-12 space-y-3">
                    <h3 className="font-display text-xs uppercase tracking-widest text-app-text-dim font-semibold mb-4">
                        About
                    </h3>
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-app-card/40 to-app-card/20 rounded-3xl backdrop-blur-glass border border-white/5" />
                        <div className="relative px-6 py-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-app-text">Salahly</h4>
                                <span className="text-app-text-dim/60 text-xs font-mono">v1.0.0</span>
                            </div>
                            <p className="text-app-text-dim text-sm font-light leading-relaxed">
                                A minimal, offline-capable spiritual companion for Islamic prayer times, Qibla direction, and reflective practice.
                            </p>
                            <div className="pt-2">
                                <p className="text-app-text-dim/60 text-xs">
                                    Prayer & Qibla Companion
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-app-card/40 to-app-card/20 rounded-3xl backdrop-blur-glass border border-white/5" />
                        <div className="relative px-6 py-6">
                            <h4 className="font-semibold text-app-text mb-2">Privacy</h4>
                            <p className="text-app-text-dim text-sm font-light leading-relaxed">
                                All data stays on your device. Location is used only for calculations. Prayer times, fasting records, and intentions are stored locally. No data is sent to external servers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
