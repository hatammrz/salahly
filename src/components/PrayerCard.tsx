import { format } from 'date-fns';
import { useCountdown } from '../hooks/useCountdown';
import { useSettings } from '../contexts/SettingsContext';
import { isRamadan } from '../utils/hijriUtils';

interface PrayerCardProps {
    name: string;
    time: Date;
    isNext: boolean;
    isPast: boolean;
}

export const PrayerCard = ({ name, time, isNext, isPast }: PrayerCardProps) => {
    const { timeRemaining } = useCountdown(isNext ? time : null);
    const { settings } = useSettings();

    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());

    const timeFormatStr = settings.timeFormat === '12' ? 'h:mm a' : 'HH:mm';
    const accentColor = inRamadan ? 'var(--ramadan)' : 'var(--accent)';

    return (
        <div
            className={`
                relative group transition-all duration-500 overflow-hidden
                ${isPast ? 'opacity-30' : 'opacity-100'}
                ${isNext ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
            `}
        >
            {/* Card background */}
            <div
                className="absolute inset-0 rounded-3xl"
                style={isNext ? {
                    background: inRamadan
                        ? 'linear-gradient(to bottom right, rgba(180,83,9,0.18), rgba(180,83,9,0.06))'
                        : 'linear-gradient(to bottom right, rgba(52,211,153,0.15), rgba(52,211,153,0.05))',
                    border: `2px solid ${accentColor}4D`,
                    boxShadow: `0 0 40px ${accentColor}20`,
                } : {
                    background: 'var(--card)',
                    border: '1px solid var(--border-card)',
                    boxShadow: 'var(--shadow)',
                }}
            />

            {/* Content */}
            <div className="relative px-6 py-5 flex justify-between items-center">
                <div className="flex-1">
                    <h3
                        className="font-display text-lg tracking-wide"
                        style={{
                            color: isNext ? accentColor : 'var(--text)',
                            fontWeight: isNext ? 'bold' : '600',
                        }}
                    >
                        {name}
                    </h3>
                    {isNext && timeRemaining && (
                        <p className="text-sm mt-1 font-light" style={{ color: 'var(--text-dim)' }}>
                            in {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                        </p>
                    )}
                </div>
                <div className="text-right">
                    <p
                        className="font-mono text-xl tracking-wide"
                        style={{
                            color: isNext ? accentColor : 'var(--text)',
                            fontWeight: isNext ? 'bold' : 'normal',
                        }}
                    >
                        {format(time, timeFormatStr)}
                    </p>
                </div>
            </div>

            {/* Hover glow for non-active cards */}
            {!isNext && !isPast && (
                <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `linear-gradient(to right, ${accentColor}0D, transparent)` }}
                />
            )}
        </div>
    );
};
