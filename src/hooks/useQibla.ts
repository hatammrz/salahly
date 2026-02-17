import { useState, useEffect } from 'react';
import { Coordinates, Qibla } from 'adhan';

interface UseQiblaResult {
    direction: number | null;
    deviceHeading: number | null;
    relativeDirection: number | null;
    error: string | null;
    permissionGranted: boolean;
}

export const useQibla = (latitude: number | null, longitude: number | null) => {
    const [state, setState] = useState<UseQiblaResult>({
        direction: null,
        deviceHeading: null,
        relativeDirection: null,
        error: null,
        permissionGranted: false,
    });

    // Calculate Qibla direction
    useEffect(() => {
        if (latitude === null || longitude === null) {
            setState(prev => ({
                ...prev,
                direction: null,
                error: 'Location not available',
            }));
            return;
        }

        try {
            const coordinates = new Coordinates(latitude, longitude);
            const qiblaDirection = Qibla(coordinates);

            setState(prev => ({
                ...prev,
                direction: qiblaDirection,
                error: null,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                direction: null,
                error: error instanceof Error ? error.message : 'Failed to calculate Qibla',
            }));
        }
    }, [latitude, longitude]);

    // Request device orientation permission
    const requestPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                if (permission === 'granted') {
                    setState(prev => ({ ...prev, permissionGranted: true }));
                    return true;
                }
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    error: 'Permission denied for device orientation',
                }));
                return false;
            }
        } else {
            // No permission needed or not supported
            setState(prev => ({ ...prev, permissionGranted: true }));
            return true;
        }
        return false;
    };

    // Listen to device orientation
    useEffect(() => {
        if (!state.permissionGranted) return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            const heading = event.alpha;

            if (heading !== null && state.direction !== null) {
                // Calculate relative direction (difference between device heading and Qibla)
                let relative = state.direction - heading;
                if (relative < 0) relative += 360;
                if (relative > 360) relative -= 360;

                setState(prev => ({
                    ...prev,
                    deviceHeading: heading,
                    relativeDirection: relative,
                }));
            }
        };

        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [state.permissionGranted, state.direction]);

    return { ...state, requestPermission };
};
