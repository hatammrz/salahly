import { useGeolocation } from '../hooks/useGeolocation';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useSettings } from '../contexts/SettingsContext';
import { isRamadan } from '../utils/hijriUtils';
import { CountdownHero } from './CountdownHero';
import { PrayerCard } from './PrayerCard';
import { DailyIntention } from './DailyIntention';

export const HomeScreen = () => {
    const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
    const { settings } = useSettings();
    const { prayerTimes, loading: prayerLoading, error: prayerError } = usePrayerTimes(
        latitude,
        longitude
    );

    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());
    const accentColor = inRamadan ? '#C6A95E' : '#34D399';

    if (locationLoading || prayerLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div
                            className="absolute inset-0 rounded-full animate-ping"
                            style={{ backgroundColor: `${accentColor}33` }}
                        />
                        <div
                            className="absolute inset-0 rounded-full backdrop-blur-glass"
                            style={{ background: `linear-gradient(to bottom right, ${accentColor}4D, ${accentColor}1A)` }}
                        />
                    </div>
                    <p className="text-app-text-dim font-light">Loading prayer times...</p>
                </div>
            </div>
        );
    }

    if (locationError || prayerError || !prayerTimes) {
        return (
            <div className="flex items-center justify-center h-full px-6">
                <div className="text-center max-w-md">
                    <p className="text-app-text-dim mb-6 font-light">
                        {locationError || prayerError || 'Unable to load prayer times'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 text-white rounded-2xl font-semibold hover:shadow-glow transition-all duration-300 backdrop-blur-glass"
                        style={{ background: `linear-gradient(to right, ${accentColor}, ${inRamadan ? '#D4B76E' : '#10B981'})` }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const now = new Date();
    const allPrayers = [
        { name: 'Fajr', time: prayerTimes.fajr },
        { name: 'Sunrise', time: prayerTimes.sunrise },
        { name: 'Dhuhr', time: prayerTimes.dhuhr },
        { name: 'Asr', time: prayerTimes.asr },
        { name: 'Maghrib', time: prayerTimes.maghrib },
        { name: 'Isha', time: prayerTimes.isha },
    ];

    // Filter out Sunrise if settings say so
    const prayers = settings.showSunrise
        ? allPrayers
        : allPrayers.filter(p => p.name !== 'Sunrise');

    // Find next prayer
    const nextPrayer = prayers.find(p => p.time > now);

    return (
        <div className="h-full overflow-y-auto pb-28">
            {nextPrayer ? (
                <CountdownHero prayerName={nextPrayer.name} prayerTime={nextPrayer.time} />
            ) : (
                /* Fallback when all prayers have passed */
                <div className="relative px-6 py-16 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
                            style={{ backgroundColor: `${accentColor}1A` }}
                        />
                    </div>
                    <div className="relative z-10 text-center animate-fade-in">
                        <p className="text-app-text-dim text-xs uppercase tracking-wider mb-3 font-semibold">
                            Alhamdulillah
                        </p>
                        <h1
                            className="font-display text-4xl font-bold text-transparent bg-clip-text drop-shadow-glow mb-4"
                            style={{
                                backgroundImage: `linear-gradient(to right, ${accentColor}, ${inRamadan ? '#D4B76E' : '#10B981'})`
                            }}
                        >
                            All Prayers Complete
                        </h1>
                        <p className="text-app-text-dim text-sm font-light">
                            May your prayers be accepted
                        </p>
                    </div>
                </div>
            )}

            {settings.showDailyIntention && <DailyIntention />}

            <div className="px-6 py-6 space-y-4">
                <h2 className="font-display text-sm uppercase tracking-widest text-app-text-dim mb-6 font-semibold">
                    Today's Prayers
                </h2>
                {prayers.map((prayer) => (
                    <PrayerCard
                        key={prayer.name}
                        name={prayer.name}
                        time={prayer.time}
                        isNext={nextPrayer?.name === prayer.name}
                        isPast={prayer.time < now}
                    />
                ))}
            </div>
        </div>
    );
};
