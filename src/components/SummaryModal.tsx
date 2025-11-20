import React from 'react';
import { Heatmap } from './Heatmap';
import type { Keystroke } from '../hooks/useKeystrokes';

interface SummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
        wpm: number;
        accuracy: number;
        mistakes: number;
        hesitations: number;
    };
    keystrokes: Keystroke[];
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, stats, keystrokes }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="p-8 border-b border-gray-800">
                    <h2 className="text-3xl font-bold text-white mb-2">Session Complete</h2>
                    <p className="text-gray-400">Here's how you performed.</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Main Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-center">
                            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">WPM</div>
                            <div className="text-4xl font-bold text-neon-green">{stats.wpm}</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-center">
                            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Accuracy</div>
                            <div className="text-4xl font-bold text-neon-blue">{stats.accuracy}%</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-center">
                            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Mistakes</div>
                            <div className="text-4xl font-bold text-neon-red">{stats.mistakes}</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-center">
                            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Hesitations</div>
                            <div className="text-4xl font-bold text-neon-yellow">{stats.hesitations}</div>
                        </div>
                    </div>

                    {/* Heatmap */}
                    <Heatmap keystrokes={keystrokes} />

                </div>

                <div className="p-6 border-t border-gray-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-neon-blue text-black font-bold rounded-lg hover:bg-blue-400 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
};
