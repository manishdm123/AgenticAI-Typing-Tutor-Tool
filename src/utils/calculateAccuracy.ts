/**
 * Calculates Accuracy percentage.
 * Accuracy = (correctKeys / totalKeys) * 100
 * 
 * @param correctKeys - Number of correct keystrokes
 * @param totalKeys - Total number of keystrokes (including errors)
 * @returns Accuracy as a percentage (0-100)
 */
export const calculateAccuracy = (correctKeys: number, totalKeys: number): number => {
    if (totalKeys === 0) return 100;

    const accuracy = (correctKeys / totalKeys) * 100;
    return Math.round(accuracy);
};
