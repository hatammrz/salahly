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

    if (!timeRemaining) {
        return null;
    }

    const timeFormatStr = settings.timeFormat === '12' ? 'h:mm a' : 'HH:mm';
    const hijriDate = getHijriDate();
    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());

    // Contextual Ramadan text
    let heroTitle = prayerName;
    let heroSubtitle = 'Next Prayer';

    if (inRamadan) {
        if (prayerName === 'Fajr') {
            heroTitle = 'Suhoor';
            heroSubtitle = 'Ends In';
        } else if (prayerName === 'Maghrib') {
            heroTitle = 'Iftar';
            heroSubtitle = 'In';
        }
    }

    const accentColor = inRamadan ? '#C6A95E' : '#34D399';
    const accentColorDim = inRamadan ? '#D4B76E' : '#10B981';

    return (
        <div
            className="relative px-6 py-16 overflow-hidden cursor-pointer select-none"
            onClick={() => setShowExactTime(!showExactTime)}
        >
            {/* Radial glow effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
                    style={{ backgroundColor: `${accentColor}1A` }}
                />
            </div>

            <div className="relative z-10 text-center animate-fade-in">
                {/* Date display - Gregorian and Hijri */}
                <div className="mb-4 space-y-1">
                    <p className="text-app-text-dim text-sm uppercase tracking-widest">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-app-text-dim/60 text-xs font-light">
                        {hijriDate.formatted}
                    </p>
                </div>

                <p className="text-app-text-dim text-xs uppercase tracking-wider mb-3 font-semibold">
                    {heroSubtitle}
                </p>

                <h1
                    className="font-display text-6xl font-bold text-transparent bg-clip-text drop-shadow-glow mb-8"
                    style={{
                        backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColorDim})`
                    }}
                >
                    {heroTitle}
                </h1>

                {/* Tap-to-toggle: countdown vs exact time */}
                {showExactTime ? (
                    <div className="mb-8">
                        <p
                            className="font-mono text-5xl font-bold transition-all duration-300"
                            style={{ color: accentColor }}
                        >
                            {format(prayerTime, timeFormatStr)}
                        </p>
                        <p className="text-app-text-dim/40 text-xs mt-3 font-light">
                            Tap to show countdown
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center items-center gap-3 mb-8">
                            <TimeUnit value={timeRemaining.hours} label="hours" accentColor={accentColor} />
                            <span className="text-app-text-dim text-4xl font-light">:</span>
                            <TimeUnit value={timeRemaining.minutes} label="min" accentColor={accentColor} />
                            <span className="text-app-text-dim text-4xl font-light">:</span>
                            <TimeUnit value={timeRemaining.seconds} label="sec" accentColor={accentColor} />
                        </div>

                        <p className="text-app-text-dim text-lg font-light">
                            at <span className="font-semibold" style={{ color: accentColor }}>
                                {format(prayerTime, timeFormatStr)}
                            </span>
                        </p>
                        <p className="text-app-text-dim/40 text-xs mt-3 font-light">
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
        <div className="relative group">
            {/* Glass morphism card */}
            <div className="absolute inset-0 bg-gradient-to-br from-app-card/40 to-app-card/20 rounded-2xl backdrop-blur-glass border border-white/10" />
            <div className="relative px-5 py-4 min-w-[90px]">
                <span className="font-mono text-5xl font-bold text-app-text drop-shadow-lg">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
        </div>
        <span
            className="text-[10px] mt-3 uppercase tracking-widest font-medium"
            style={{ color: `${accentColor}CC` }}
        >
            {label}
        </span>
    </div>
);
