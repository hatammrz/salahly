import { useState } from 'react';
import { format } from 'date-fns';
import { useCountdown } from '../hooks/useCountdown';
import { useSettings } from '../contexts/SettingsContext';
import { getHijriDate, isRamadan } from '../utils/hijriUtils';

interface CountdownHeroProps {
    prayerName: string;
    prayerTime: Date;
}

export const CountdownHero = ({ prayerName, prayerTime }: CountdownHeroProps) => {
    const { timeRemaining } = useCountdown(prayerTime);
    const { settings } = useSettings();
    const [showExactTime, setShowExactTime] = useState(false);

    if (!timeRemaining) return null;

    const timeFormatStr = settings.timeFormat === '12' ? 'h:mm a' : 'HH:mm';
    const hijriDate = getHijriDate();
    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());

    let heroTitle = prayerName;
    let heroSubtitle = 'Next Prayer';

    if (inRamadan) {
        if (prayerName === 'Fajr') { heroTitle = 'Suhoor'; heroSubtitle = 'Ends In'; }
        else if (prayerName === 'Maghrib') { heroTitle = 'Iftar'; heroSubtitle = 'In'; }
    }

    const accentColor = inRamadan ? 'var(--ramadan)' : 'var(--accent)';
    const accentColorDim = inRamadan ? 'var(--ramadan-dim)' : 'var(--accent-dim)';
    const glowBg = inRamadan ? 'rgba(180,83,9,0.1)' : 'rgba(52,211,153,0.1)';

    return (
        <div
            className="relative px-6 py-16 overflow-hidden cursor-pointer select-none"
            onClick={() => setShowExactTime(!showExactTime)}
        >
            {/* Radial glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
                    style={{ backgroundColor: glowBg }}
                />
            </div>

            <div className="relative z-10 text-center animate-fade-in">
                {/* Date */}
                <div className="mb-4 space-y-1">
                    <p className="text-sm uppercase tracking-widest font-light" style={{ color: 'var(--text-dim)' }}>
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-xs font-light" style={{ color: 'var(--text-dim)', opacity: 0.6 }}>
                        {hijriDate.formatted}
                    </p>
                </div>

                <p className="text-xs uppercase tracking-wider mb-3 font-semibold" style={{ color: 'var(--text-dim)' }}>
                    {heroSubtitle}
                </p>

                <h1
                    className="font-display text-6xl font-bold text-transparent bg-clip-text mb-8"
                    style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColorDim})` }}
                >
                    {heroTitle}
                </h1>

                {showExactTime ? (
                    <div className="mb-8">
                        <p className="font-mono text-5xl font-bold" style={{ color: accentColor }}>
                            {format(prayerTime, timeFormatStr)}
                        </p>
                        <p className="text-xs mt-3 font-light" style={{ color: 'var(--text-dim)', opacity: 0.4 }}>
                            Tap to show countdown
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center items-center gap-3 mb-8">
                            <TimeUnit value={timeRemaining.hours} label="hours" accentColor={accentColor} />
                            <span className="text-4xl font-light" style={{ color: 'var(--text-dim)' }}>:</span>
                            <TimeUnit value={timeRemaining.minutes} label="min" accentColor={accentColor} />
                            <span className="text-4xl font-light" style={{ color: 'var(--text-dim)' }}>:</span>
                            <TimeUnit value={timeRemaining.seconds} label="sec" accentColor={accentColor} />
                        </div>

                        <p className="text-lg font-light" style={{ color: 'var(--text-dim)' }}>
                            at <span className="font-semibold" style={{ color: accentColor }}>
                                {format(prayerTime, timeFormatStr)}
                            </span>
                        </p>
                        <p className="text-xs mt-3 font-light" style={{ color: 'var(--text-dim)', opacity: 0.4 }}>
                            Tap to show exact time
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

const TimeUnit = ({ value, label, accentColor }: { value: number; label: string; accentColor: string }) => (
    <div className="flex flex-col items-center">
        <div className="relative">
            <div
                className="absolute inset-0 rounded-2xl"
                style={{ background: 'var(--card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }}
            />
            <div className="relative px-5 py-4 min-w-[90px]">
                <span className="font-mono text-5xl font-bold" style={{ color: 'var(--text)' }}>
                    {String(value).padStart(2, '0')}
                </span>
            </div>
        </div>
        <span className="text-[10px] mt-3 uppercase tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            {label}
        </span>
    </div>
);
