import React, { useState } from 'react';
import clsx from 'clsx';

interface CuratorWidgetProps {
    onTextGenerated: (text: string) => void;
}

export const CuratorWidget: React.FC<CuratorWidgetProps> = ({ onTextGenerated }) => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ interests: topic }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate content. Is the backend running?');
            }

            const data = await response.json();
            onTextGenerated(data.text);
            setIsOpen(false);
            setTopic('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                    isOpen ? "bg-red-500 rotate-45" : "bg-neon-blue hover:bg-neon-green"
                )}
                title="Content Curator"
            >
                <span className="text-2xl font-bold text-black">+</span>
            </button>

            {/* Widget Panel */}
            <div
                className={clsx(
                    "absolute bottom-16 right-0 w-80 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl transition-all duration-300 origin-bottom-right",
                    isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
                )}
            >
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green mb-2">
                    Content Curator
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                    Enter a topic, and I'll generate a custom typing drill for you.
                </p>

                <form onSubmit={handleGenerate} className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Sci-Fi, Python, History..."
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                        disabled={isLoading}
                    />

                    {error && (
                        <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className={clsx(
                            "w-full py-2 rounded font-medium text-sm transition-all",
                            isLoading
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-neon-blue text-black hover:bg-neon-green"
                        )}
                    >
                        {isLoading ? "Generating..." : "Generate Drill"}
                    </button>
                </form>
            </div>
        </div>
    );
};
