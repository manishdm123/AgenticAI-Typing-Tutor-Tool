import React, { useRef, useEffect } from 'react';

interface TypingInputProps {
    onInput: (key: string) => void;
    isFocused: boolean;
    onFocusChange: (focused: boolean) => void;
}

export const TypingInput: React.FC<TypingInputProps> = ({ onInput, isFocused, onFocusChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Prevent default behavior for some keys if needed, but usually we want to capture the key
        // We might want to prevent default for Backspace to avoid navigation if that was an issue (not in modern browsers usually)
        // But we definitely want to capture it.

        // We pass the key to the parent
        onInput(e.key);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // We rely on onKeyDown for capturing keys including special ones like Backspace
        // But we need to keep the input empty to avoid issues
        e.target.value = '';
    };

    return (
        <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 w-0 h-0"
            autoFocus
            onBlur={() => onFocusChange(false)}
            onFocus={() => onFocusChange(true)}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            aria-label="Typing Input"
        />
    );
};
