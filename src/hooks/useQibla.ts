import { useState, useEffect, useCallback } from 'react';
import { Coordinates, Qibla } from 'adhan';

interface UseQiblaResult {
    direction: number | null;       // Absolute Qibla bearing (0–360°)
    deviceHeading: number | null;   // Device compass heading (0–360°)
    relativeDirection: number | null; // Needle angle relative to device heading (-180 to 180)
    error: string | null;
    permissionGranted: boolean;
    requestPermission: () => Promise<boolean>;
}

export const useQibla = (latitude: number | null, longitude: number | null): UseQiblaResult => {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
    const [relativeDirection, setRelativeDirection] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Calculate Qibla direction from coordinates
    useEffect(() => {
        if (latitude === null || longitude === null) {
            setQiblaDirection(null);
            setError('Location not available');
            return;
        }
        try {
            const coordinates = new Coordinates(latitude, longitude);
            const dir = Qibla(coordinates);
            setQiblaDirection(dir);
            setError(null);
        } catch (err) {
            setQiblaDirection(null);
            setError(err instanceof Error ? err.message : 'Failed to calculate Qibla');
        }
    }, [latitude, longitude]);

    // Request device orientation permission
    const requestPermission = useCallback(async (): Promise<boolean> => {
        // iOS 13+ requires explicit permission
        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof (DeviceOrientationEvent as any).requestPermission === 'function'
        ) {
            try {
                const result = await (DeviceOrientationEvent as any).requestPermission();
                if (result === 'granted') {
                    setPermissionGranted(true);
                    return true;
                }
                setError('Compass permission denied. Please allow in browser settings.');
                return false;
            } catch {
                setError('Could not request compass permission.');
                return false;
            }
        } else {
            // Android / desktop — no permission needed
            setPermissionGranted(true);
            return true;
        }
    }, []);

    // Auto-grant permission for non-iOS devices on mount
    useEffect(() => {
        const isIOS =
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof (DeviceOrientationEvent as any).requestPermission === 'function';
        if (!isIOS) {
            setPermissionGranted(true);
        }
    }, []);

    // Listen to device orientation
    useEffect(() => {
        if (!permissionGranted) return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            // webkitCompassHeading is available on iOS and gives true north heading
            // On Android, alpha = rotation around Z axis (counter-clockwise from arbitrary 0)
            // We convert: compassHeading = 360 - alpha for Android
            let heading: number | null = null;

            if ((event as any).webkitCompassHeading != null) {
                // iOS: direct compass heading in degrees clockwise from north
                heading = (event as any).webkitCompassHeading as number;
            } else if (event.alpha != null) {
                // Android: alpha is CCW from arbitrary zero; convert to CW compass heading
                heading = 360 - event.alpha;
            }

            if (heading === null) return;

            setDeviceHeading(heading);

            if (qiblaDirection !== null) {
                // Compute the angle the needle must rotate relative to the phone's orientation.
                // When relativeDirection === 0, the needle points exactly at Qibla.
                let rel = qiblaDirection - heading;
                // Normalize to -180..+180 so the needle always takes the shortest arc
                rel = ((rel + 180) % 360 + 360) % 360 - 180;
                setRelativeDirection(rel);
            }
        };

        window.addEventListener('deviceorientation', handleOrientation, true);
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation, true);
        };
    }, [permissionGranted, qiblaDirection]);

    return {
        direction: qiblaDirection,
        deviceHeading,
        relativeDirection,
        error,
        permissionGranted,
        requestPermission,
    };
};
