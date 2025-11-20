import { useState, useEffect } from 'react';
import type { Keystroke } from './useKeystrokes';
import { calculateWpm } from '../utils/calculateWpm';
import { calculateAccuracy } from '../utils/calculateAccuracy';

interface UseMetricsProps {
    keystrokes: Keystroke[];
    startTime: number | null;
}

export const useMetrics = ({ keystrokes, startTime }: UseMetricsProps) => {
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [mistakes, setMistakes] = useState(0);
    const [hesitations, setHesitations] = useState(0);

    useEffect(() => {
        if (!startTime || keystrokes.length === 0) {
            setWpm(0);
            setAccuracy(100);
            setMistakes(0);
            setHesitations(0);
            return;
        }

        const now = performance.now();
        const correctKeys = keystrokes.filter(k => k.correct).length;
        const totalKeys = keystrokes.length;
        const mistakeCount = keystrokes.filter(k => !k.correct).length;
        const hesitationCount = keystrokes.filter(k => k.latency > 300).length;

        const currentWpm = calculateWpm(correctKeys, startTime, now);
        const currentAccuracy = calculateAccuracy(correctKeys, totalKeys);

        setWpm(currentWpm);
        setAccuracy(currentAccuracy);
        setMistakes(mistakeCount);
        setHesitations(hesitationCount);

    }, [keystrokes, startTime]);

    return {
        wpm,
        accuracy,
        mistakes,
        hesitations
    };
};
