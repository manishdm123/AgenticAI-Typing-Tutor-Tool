import { useState, useCallback } from 'react';

export interface Keystroke {
    key: string;
    expected: string;
    correct: boolean;
    timestamp: number;
    latency: number;
    index: number;
}

interface UseKeystrokesProps {
    referenceText: string;
    onComplete?: () => void;
}

export const useKeystrokes = ({ referenceText, onComplete }: UseKeystrokesProps) => {
    const [input, setInput] = useState('');
    const [cursorIndex, setCursorIndex] = useState(0);
    const [keystrokes, setKeystrokes] = useState<Keystroke[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const reset = useCallback(() => {
        setInput('');
        setCursorIndex(0);
        setKeystrokes([]);
        setStartTime(null);
        setIsFinished(false);
    }, []);

    const handleInput = useCallback((key: string) => {
        if (isFinished) return;

        const now = performance.now();
        if (startTime === null) {
            setStartTime(now);
        }

        // Handle Backspace
        if (key === 'Backspace') {
            if (cursorIndex > 0) {
                setInput(prev => prev.slice(0, -1));
                setCursorIndex(prev => prev - 1);
            }
            return;
        }

        // Ignore non-character keys (modifiers, etc.) unless it's a valid char
        if (key.length !== 1) return;

        const expectedChar = referenceText[cursorIndex];
        const isCorrect = key === expectedChar;

        // Calculate latency
        const lastKeystroke = keystrokes[keystrokes.length - 1];
        const latency = lastKeystroke ? now - lastKeystroke.timestamp : 0;

        const newKeystroke: Keystroke = {
            key,
            expected: expectedChar,
            correct: isCorrect,
            timestamp: now,
            latency,
            index: cursorIndex
        };

        setKeystrokes(prev => [...prev, newKeystroke]);
        setInput(prev => prev + key);
        setCursorIndex(prev => prev + 1);

        if (cursorIndex + 1 >= referenceText.length) {
            setIsFinished(true);
            if (onComplete) onComplete();
        }
    }, [cursorIndex, isFinished, keystrokes, referenceText, startTime, onComplete]);

    return {
        input,
        cursorIndex,
        keystrokes,
        startTime,
        isFinished,
        handleInput,
        reset
    };
};
