import { useState, useEffect } from 'react';

// const [countDown, isCompleted] = useCountdownTimer(startTime, onComplete);

const useCountdownTimer = (startTime: number, onComplete?: () => void) => {
    const [timeLeft, setTimeLeft] = useState(startTime);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (!isCompleted) {
                setIsCompleted(true);
                if (onComplete) {
                    onComplete(); // Trigger the completion callback
                }
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        // Cleanup interval on unmount
        return () => clearInterval(timer);
    }, [timeLeft, onComplete, isCompleted]);

    // Return formatted time as double digits and completion status

    const formattedTime = String(timeLeft).padStart(2, '0');

    const hookData = [formattedTime, isCompleted];
    return hookData;
};

export default useCountdownTimer;
