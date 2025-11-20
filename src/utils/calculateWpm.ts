/**
 * Calculates Words Per Minute (WPM).
 * WPM = (correctCharacters / 5) / (elapsedMinutes)
 * 
 * @param correctCharacters - Number of correctly typed characters
 * @param startTime - Timestamp when typing started (ms)
 * @param currentTime - Current timestamp (ms)
 * @returns WPM as a number
 */
export const calculateWpm = (correctCharacters: number, startTime: number | null, currentTime: number): number => {
    if (!startTime || currentTime <= startTime) return 0;

    const elapsedMinutes = (currentTime - startTime) / 60000;
    if (elapsedMinutes === 0) return 0;

    const wpm = (correctCharacters / 5) / elapsedMinutes;
    return Math.round(wpm);
};
