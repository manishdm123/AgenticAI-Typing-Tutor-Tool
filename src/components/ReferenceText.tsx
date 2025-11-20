import React from 'react';
import clsx from 'clsx';

interface ReferenceTextProps {
    text: string;
    input: string;
    cursorIndex: number;
}

export const ReferenceText: React.FC<ReferenceTextProps> = ({ text, input, cursorIndex }) => {
    return (
        <div className="font-mono text-2xl leading-relaxed break-all max-w-3xl mx-auto p-6 bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 relative">
            {text.split('').map((char, index) => {
                const isTyped = index < cursorIndex;
                const isCurrent = index === cursorIndex;
                const typedChar = input[index];
                const isCorrect = isTyped && typedChar === char;

                return (
                    <span
                        key={index}
                        className={clsx(
                            "relative transition-colors duration-100",
                            {
                                "text-neon-green text-shadow-green": isCorrect,
                                "text-neon-red text-shadow-red": isTyped && !isCorrect,
                                "text-gray-500": !isTyped && !isCurrent,
                                "text-neon-yellow text-shadow-yellow": isCurrent,
                            }
                        )}
                    >
                        {/* Cursor Overlay */}
                        {isCurrent && (
                            <span className="absolute -left-[1px] -top-1 bottom-0 w-[2px] bg-neon-yellow animate-pulse shadow-[0_0_8px_rgba(255,255,0,0.8)]" />
                        )}
                        {char}
                    </span>
                );
            })}
        </div>
    );
};
