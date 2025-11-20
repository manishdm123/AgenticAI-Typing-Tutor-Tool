import React from 'react';

interface StatsBarProps {
    wpm: number;
    accuracy: number;
    mistakes: number;
    hesitations: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ wpm, accuracy, mistakes, hesitations }) => {
    return (
        <div className="flex justify-center gap-8 mb-8 p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm border border-gray-700/50">
            <StatItem label="WPM" value={wpm} color="text-neon-green" />
            <StatItem label="Accuracy" value={`${accuracy}%`} color="text-neon-blue" />
            <StatItem label="Mistakes" value={mistakes} color="text-neon-red" />
            <StatItem label="Hesitations" value={hesitations} color="text-neon-yellow" />
        </div>
    );
};

const StatItem: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
    <div className="flex flex-col items-center">
        <span className="text-xs uppercase tracking-wider text-gray-400 mb-1">{label}</span>
        <span className={`text-2xl font-bold ${color} drop-shadow-md`}>{value}</span>
    </div>
);
