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

    const accentColor = inRamadan ? '#C6A95E' : '#34D399';
    const textColor = '#F1F5F9';

    return (
        <div
            className={`
                relative group transition-all duration-500 overflow-hidden
                ${isPast ? 'opacity-30' : 'opacity-100'}
                ${isNext ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
            `}
        >
            {/* Glassmorphism card */}
            <div
                className={`
                    absolute inset-0 rounded-3xl backdrop-blur-glass
                    ${isNext
                        ? 'border-2'
                        : 'bg-gradient-to-br from-app-card/40 to-app-card/20 border border-white/5'
                    }
                `}
                style={isNext ? {
                    background: `linear-gradient(to bottom right, ${accentColor}33, ${accentColor}0D)`,
                    borderColor: `${accentColor}4D`,
                    boxShadow: `0 0 40px ${accentColor}25`
                } : undefined}
            />

            {/* Content */}
            <div className="relative px-6 py-5 flex justify-between items-center">
                <div className="flex-1">
                    <h3
                        className="font-display text-lg tracking-wide"
                        style={{
                            color: isNext ? accentColor : textColor,
                            fontWeight: isNext ? 'bold' : '600'
                        }}
                    >
                        {name}
                    </h3>
                    {isNext && timeRemaining && (
                        <p className="text-app-text-dim text-sm mt-1 font-light">
                            in {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                        </p>
                    )}
                </div>
                <div className="text-right">
                    <p
                        className="font-mono text-xl tracking-wide"
                        style={{
                            color: isNext ? accentColor : textColor,
                            fontWeight: isNext ? 'bold' : 'normal'
                        }}
                    >
                        {format(time, timeFormatStr)}
                    </p>
                </div>
            </div>

            {/* Subtle hover glow for non-active cards */}
            {!isNext && !isPast && (
                <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `linear-gradient(to right, ${accentColor}0D, transparent)` }}
                />
            )}
        </div>
    );
};
