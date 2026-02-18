import { useSettings } from '../contexts/SettingsContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { isRamadan } from '../utils/hijriUtils';
import { Clock, Eye, EyeOff, Moon, Heart, Sun, Monitor } from 'lucide-react';

export const SettingsScreen = () => {
    const { settings, updateSettings } = useSettings();
    const { theme, setTheme } = useTheme();
    const currentlyInRamadan = isRamadan();
    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && currentlyInRamadan);
    const accentColor = inRamadan ? 'var(--ramadan)' : 'var(--accent)';

    const themeLabel: Record<ThemeMode, string> = { dark: 'Dark', light: 'Light', auto: 'Auto' };
    const themeOrder: ThemeMode[] = ['dark', 'light', 'auto'];

    const settingsSections = [
        {
            title: 'Appearance',
            items: [
                {
                    icon: Monitor,
                    label: 'Theme',
                    value: themeLabel[theme],
                    action: () => {
                        const next = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
                        setTheme(next);
                    },
                },
            ],
        },
        {
            title: 'Display',
            items: [
                {
                    icon: Clock,
                    label: 'Time Format',
                    value: settings.timeFormat === '12' ? '12-hour' : '24-hour',
                    action: () => updateSettings({ timeFormat: settings.timeFormat === '12' ? '24' : '12' }),
                },
                {
                    icon: settings.showSunrise ? Eye : EyeOff,
                    label: 'Show Sunrise',
                    value: settings.showSunrise ? 'Visible' : 'Hidden',
                    action: () => updateSettings({ showSunrise: !settings.showSunrise }),
                },
            ],
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
                        const next = modes[(modes.indexOf(settings.ramadanMode) + 1) % modes.length];
                        updateSettings({ ramadanMode: next });
                    },
                },
            ],
        },
        {
            title: 'Reflection',
            items: [
                {
                    icon: Heart,
                    label: 'Daily Intention',
                    value: settings.showDailyIntention ? 'Shown' : 'Hidden',
                    action: () => updateSettings({ showDailyIntention: !settings.showDailyIntention }),
                },
            ],
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
                        const next = modes[(modes.indexOf(settings.backgroundMode) + 1) % modes.length];
                        updateSettings({ backgroundMode: next });
                    },
                },
            ],
        },
    ];

    return (
        <div className="h-full overflow-y-auto pb-28 px-6 py-8">
            <div className="mb-8">
                <h2 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                    Settings
                </h2>
                <p className="text-sm font-light" style={{ color: 'var(--text-dim)' }}>
                    Customize your prayer companion
                </p>
            </div>

            <div className="space-y-6">
                {settingsSections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="space-y-3">
                        <h3
                            className="font-display text-xs uppercase tracking-widest font-semibold mb-4 flex items-center gap-2"
                            style={{ color: 'var(--text-dim)' }}
                        >
                            {section.title}
                            {section.subtitle && (
                                <span style={{ color: 'var(--ramadan)' }} className="normal-case text-[10px]">
                                    {section.subtitle}
                                </span>
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
                                    {/* Card */}
                                    <div
                                        className="absolute inset-0 rounded-3xl transition-all duration-300"
                                        style={{
                                            background: 'var(--card)',
                                            border: '1px solid var(--border-card)',
                                            boxShadow: 'var(--shadow)',
                                        }}
                                    />
                                    {/* Hover glow */}
                                    <div
                                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: `linear-gradient(to right, ${accentColor}0D, transparent)` }}
                                    />

                                    <div className="relative px-6 py-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: `${accentColor}1A` }}
                                            >
                                                <Icon className="w-5 h-5" style={{ color: accentColor }} strokeWidth={2} />
                                            </div>
                                            <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                                                {item.label}
                                            </p>
                                        </div>
                                        <div
                                            className="px-4 py-1.5 rounded-xl border"
                                            style={{
                                                backgroundColor: `${accentColor}1A`,
                                                borderColor: `${accentColor}33`,
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

                {/* About */}
                <div className="mt-12 space-y-3">
                    <h3 className="font-display text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: 'var(--text-dim)' }}>
                        About
                    </h3>
                    <div className="relative overflow-hidden">
                        <div
                            className="absolute inset-0 rounded-3xl"
                            style={{ background: 'var(--card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }}
                        />
                        <div className="relative px-6 py-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold" style={{ color: 'var(--text)' }}>Qamar</h4>
                                <span className="text-xs font-mono" style={{ color: 'var(--text-dim)', opacity: 0.6 }}>v1.0.0</span>
                            </div>
                            <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                                Qamar is a minimal, privacy-focused prayer time, Qibla, and fasting companion.
                            </p>
                            <div className="pt-2">
                                <p className="text-xs" style={{ color: 'var(--text-dim)', opacity: 0.6 }}>
                                    Prayer &amp; Qibla Companion
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        <div
                            className="absolute inset-0 rounded-3xl"
                            style={{ background: 'var(--card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }}
                        />
                        <div className="relative px-6 py-6">
                            <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Privacy</h4>
                            <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                                All data stays on your device. Location is used only for calculations. No data is sent to external servers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
