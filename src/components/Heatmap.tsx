import React from 'react';
import { KEYBOARD_LAYOUT } from '../utils/keyboardLayout';
import type { Keystroke } from '../hooks/useKeystrokes';
import clsx from 'clsx';

interface HeatmapProps {
    keystrokes: Keystroke[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ keystrokes }) => {
    // Compute error rates
    const keyStats = new Map<string, { pressCount: number; mistakeCount: number }>();

    keystrokes.forEach(k => {
        const key = k.expected.toLowerCase();
        const stats = keyStats.get(key) || { pressCount: 0, mistakeCount: 0 };
        stats.pressCount++;
        if (!k.correct) {
            stats.mistakeCount++;
        }
        keyStats.set(key, stats);
    });

    const getKeyColor = (keyLabel: string) => {
        const key = keyLabel.toLowerCase();
        const stats = keyStats.get(key);

        if (!stats || stats.pressCount === 0) return 'bg-gray-700 text-gray-400';

        const errorRate = stats.mistakeCount / stats.pressCount;

        // Gradient from gray (0 errors) to red (100% errors)
        if (errorRate === 0) return 'bg-gray-600 text-white';
        if (errorRate < 0.2) return 'bg-yellow-800 text-yellow-100';
        if (errorRate < 0.5) return 'bg-orange-800 text-orange-100';
        return 'bg-red-900 text-red-100 border-red-500 border';
    };

    return (
        <div className="flex flex-col gap-2 items-center p-6 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-lg text-gray-400 mb-4">Error Heatmap</h3>
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1">
                    {row.map((keyData) => (
                        <div
                            key={keyData.key}
                            className={clsx(
                                "h-10 flex items-center justify-center rounded text-sm font-medium transition-colors",
                                getKeyColor(keyData.key)
                            )}
                            style={{ width: `${(keyData.width || 1) * 40}px` }}
                        >
                            {keyData.label}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
