import { useState, useEffect, useRef } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useQibla } from '../hooks/useQibla';
import { useSettings } from '../contexts/SettingsContext';
import { isRamadan } from '../utils/hijriUtils';
import { Compass } from 'lucide-react';

export const QiblaScreen = () => {
    const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
    const { direction, relativeDirection, error: qiblaError, permissionGranted, requestPermission } = useQibla(latitude, longitude);
    const { settings } = useSettings();
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);
    const wasAligned = useRef(false);

    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());

    const accentColor = inRamadan ? '#C6A95E' : '#34D399';
    const accentColorDim = inRamadan ? '#D4B76E' : '#10B981';

    const isAligned = relativeDirection !== null && Math.abs(relativeDirection) < 5;

    // Haptic feedback when alignment changes to true
    useEffect(() => {
        if (isAligned && !wasAligned.current) {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
        wasAligned.current = isAligned;
    }, [isAligned]);

    const handleRequestPermission = async () => {
        await requestPermission();
        setShowPermissionPrompt(false);
    };

    if (locationLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `${accentColor}33` }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Compass className="w-10 h-10 animate-pulse" style={{ color: accentColor }} />
                        </div>
                    </div>
                    <p className="font-light" style={{ color: 'var(--text-dim)' }}>Loading location...</p>
                </div>
            </div>
        );
    }

    if (locationError || qiblaError || direction === null) {
        return (
            <div className="flex items-center justify-center h-full px-6">
                <div className="text-center max-w-md">
                    <p className="mb-6 font-light" style={{ color: 'var(--text-dim)' }}>
                        {locationError || qiblaError || 'Unable to calculate Qibla direction'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 text-white rounded-2xl font-semibold transition-all duration-300"
                        style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColorDim})` }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center px-6 pb-28 relative">
            {/* Gold glow overlay when aligned */}
            {isAligned && (
                <div
                    className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at center, ${accentColor}15 0%, transparent 70%)`
                    }}
                />
            )}

            {!permissionGranted && showPermissionPrompt && (
                <div className="mb-8 w-full max-w-md animate-fade-in">
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 rounded-3xl" style={{ background: 'var(--card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }} />
                        <div className="relative p-6">
                            <p className="mb-4 text-sm font-light leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                                Enable device orientation to use the live compass
                            </p>
                            <button
                                onClick={handleRequestPermission}
                                className="w-full px-6 py-3 text-white rounded-2xl font-semibold transition-all duration-300"
                                style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColorDim})` }}
                            >
                                Enable Compass
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center mb-10">
                <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: 'var(--text-dim)' }}>
                    Qibla Direction
                </p>
                <h1
                    className="font-display text-5xl font-bold text-transparent bg-clip-text drop-shadow-glow"
                    style={{
                        backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColorDim})`
                    }}
                >
                    {Math.round(direction)}°
                </h1>
            </div>

            <div
                className={`
                    relative w-72 h-72 rounded-full transition-all duration-500
                    ${isAligned ? 'scale-110' : 'scale-100'}
                `}
            >
                {/* Outer glow ring */}
                <div
                    className={`
                        absolute inset-0 rounded-full transition-all duration-500
                        ${isAligned
                            ? 'animate-pulse-slow'
                            : ''
                        }
                    `}
                    style={isAligned
                        ? { backgroundColor: `${accentColor}33`, boxShadow: `0 0 40px ${accentColor}25` }
                        : { background: 'var(--card)', border: '1px solid var(--border-card)' }}
                />

                {/* Compass visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 200 200"
                        style={{
                            transform: relativeDirection !== null ? `rotate(${relativeDirection}deg)` : 'none',
                            transition: 'transform 0.3s ease-out',
                        }}
                    >
                        {/* Degree tick marks */}
                        {Array.from({ length: 72 }).map((_, i) => {
                            const angle = i * 5;
                            const isMajor = angle % 90 === 0;
                            const isMinor = angle % 30 === 0;
                            const len = isMajor ? 12 : isMinor ? 8 : 4;
                            const r1 = 90;
                            const r2 = r1 - len;
                            const rad = (angle * Math.PI) / 180;
                            return (
                                <line
                                    key={i}
                                    x1={100 + r1 * Math.sin(rad)}
                                    y1={100 - r1 * Math.cos(rad)}
                                    x2={100 + r2 * Math.sin(rad)}
                                    y2={100 - r2 * Math.cos(rad)}
                                    stroke={isMajor ? '#94A3B8' : '#475569'}
                                    strokeWidth={isMajor ? 2 : 1}
                                    opacity={isMajor ? 0.8 : 0.4}
                                />
                            );
                        })}

                        {/* Cardinal direction labels */}
                        <text x="100" y="28" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="bold" fontFamily="Inter">N</text>
                        <text x="176" y="104" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="600" fontFamily="Inter">E</text>
                        <text x="100" y="180" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="600" fontFamily="Inter">S</text>
                        <text x="24" y="104" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="600" fontFamily="Inter">W</text>

                        {/* Compass needle */}
                        <g>
                            <defs>
                                <linearGradient id="needleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor={isAligned ? accentColor : '#F1F5F9'} />
                                    <stop offset="100%" stopColor={isAligned ? accentColorDim : '#94A3B8'} />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 100 35 L 105 100 L 100 165 L 95 100 Z"
                                fill="url(#needleGradient)"
                                className="drop-shadow-lg transition-all duration-300"
                            />
                            <circle
                                cx="100"
                                cy="100"
                                r="8"
                                fill={isAligned ? accentColor : '#1E293B'}
                                stroke={isAligned ? accentColor : '#F1F5F9'}
                                strokeWidth="2.5"
                                className="transition-all duration-300"
                            />
                        </g>
                    </svg>
                </div>
            </div>

            {isAligned && (
                <div className="mt-10 text-center animate-fade-in">
                    <div
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border"
                        style={{
                            backgroundColor: `${accentColor}1A`,
                            borderColor: `${accentColor}4D`
                        }}
                    >
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: accentColor }}
                        />
                        <p className="font-semibold text-sm" style={{ color: accentColor }}>
                            Aligned with Qibla
                        </p>
                    </div>
                </div>
            )}

            {!permissionGranted && (
                <div className="mt-10 text-center">
                    <p className="text-xs font-light" style={{ color: 'var(--text-dim)', opacity: 0.6 }}>
                        Static direction shown. Enable compass for live orientation.
                    </p>
                </div>
            )}
        </div>
    );
};
