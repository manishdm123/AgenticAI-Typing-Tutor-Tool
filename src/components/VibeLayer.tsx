import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

interface VibeLayerProps {
    lastKeystroke: { correct: boolean; latency: number } | null;
    streak: number;
}

export const VibeLayer: React.FC<VibeLayerProps> = ({ lastKeystroke, streak }) => {
    const [vibe, setVibe] = useState<string | null>(null);

    useEffect(() => {
        if (!lastKeystroke) return;

        if (!lastKeystroke.correct) {
            setVibe('shake-red');
        } else if (lastKeystroke.latency > 300) {
            setVibe('glow-yellow');
        } else if (streak > 0 && streak % 5 === 0) {
            setVibe('pulse-blue');
        } else {
            setVibe('pulse-green');
        }

        const timer = setTimeout(() => setVibe(null), 300);
        return () => clearTimeout(timer);
    }, [lastKeystroke, streak]);

    return (
        <div
            className={clsx(
                "fixed inset-0 pointer-events-none transition-colors duration-300 z-0",
                {
                    "bg-red-500/10": vibe === 'shake-red',
                    "bg-yellow-500/5": vibe === 'glow-yellow',
                    "bg-blue-500/5": vibe === 'pulse-blue',
                    "bg-green-500/5": vibe === 'pulse-green',
                }
            )}
        >
            {/* We can add more complex particles or overlays here */}
        </div>
    );
};
