import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

interface UseCountdownResult {
    timeRemaining: {
        hours: number;
        minutes: number;
        seconds: number;
    } | null;
    isNext: boolean;
}

export const useCountdown = (targetTime: Date | null): UseCountdownResult => {
    const [timeRemaining, setTimeRemaining] = useState<{
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        if (!targetTime) {
            setTimeRemaining(null);
            return;
        }

        const updateCountdown = () => {
            const now = new Date();
            const secondsLeft = differenceInSeconds(targetTime, now);

            if (secondsLeft <= 0) {
                setTimeRemaining(null);
                return;
            }

            const hours = Math.floor(secondsLeft / 3600);
            const minutes = Math.floor((secondsLeft % 3600) / 60);
            const seconds = secondsLeft % 60;

            setTimeRemaining({ hours, minutes, seconds });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    return {
        timeRemaining,
        isNext: timeRemaining !== null,
    };
};
