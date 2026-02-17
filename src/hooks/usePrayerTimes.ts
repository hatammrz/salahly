import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

interface UsePrayerTimesResult {
    prayerTimes: PrayerTimes | null;
    loading: boolean;
    error: string | null;
}

export const usePrayerTimes = (
    latitude: number | null,
    longitude: number | null
): UsePrayerTimesResult => {
    const [state, setState] = useState<UsePrayerTimesResult>({
        prayerTimes: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (latitude === null || longitude === null) {
            setState({
                prayerTimes: null,
                loading: false,
                error: 'Location not available',
            });
            return;
        }

        try {
            const coordinates = new Coordinates(latitude, longitude);
            const params = CalculationMethod.MuslimWorldLeague();

            const date = new Date();
            const prayerTimes = new PrayerTimes(coordinates, date, params);

            setState({
                prayerTimes,
                loading: false,
                error: null,
            });
        } catch (error) {
            setState({
                prayerTimes: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to calculate prayer times',
            });
        }
    }, [latitude, longitude]);

    return state;
};
