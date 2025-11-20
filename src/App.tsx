import { useState, useEffect, useCallback } from 'react';
import { TypingInput } from './components/TypingInput';
import { ReferenceText } from './components/ReferenceText';
import { StatsBar } from './components/StatsBar';
import { VibeLayer } from './components/VibeLayer';
import { SummaryModal } from './components/SummaryModal';
import { useKeystrokes } from './hooks/useKeystrokes';
import { useMetrics } from './hooks/useMetrics';
import clsx from 'clsx';

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. Sphinx of black quartz, judge my vow.";

function App() {
  const [isFocused, setIsFocused] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleComplete = useCallback(() => {
    setShowSummary(true);
  }, []);

  const {
    input,
    cursorIndex,
    keystrokes,
    startTime,
    isFinished,
    handleInput,
    reset: resetKeystrokes
  } = useKeystrokes({
    referenceText: SAMPLE_TEXT,
    onComplete: handleComplete
  });

  const metrics = useMetrics({ keystrokes, startTime });

  // Calculate streak
  useEffect(() => {
    if (keystrokes.length === 0) {
      setStreak(0);
      return;
    }
    const last = keystrokes[keystrokes.length - 1];
    if (last.correct) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  }, [keystrokes]);

  const handleRestart = () => {
    resetKeystrokes();
    setShowSummary(false);
    // Refocus input
    setIsFocused(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Vibe Layer */}
      <VibeLayer
        lastKeystroke={keystrokes.length > 0 ? keystrokes[keystrokes.length - 1] : null}
        streak={streak}
      />

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green drop-shadow-lg">
          Vibe Typing Tool
        </h1>

        <StatsBar
          wpm={metrics.wpm}
          accuracy={metrics.accuracy}
          mistakes={metrics.mistakes}
          hesitations={metrics.hesitations}
        />

        <div
          className={clsx(
            "relative w-full transition-all duration-300",
            { "blur-sm opacity-50": !isFocused && !showSummary }
          )}
          onClick={() => setIsFocused(true)}
        >
          <ReferenceText
            text={SAMPLE_TEXT}
            input={input}
            cursorIndex={cursorIndex}
          />

          {!isFocused && !showSummary && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xl text-gray-400 animate-bounce">Click to focus</div>
            </div>
          )}
        </div>

        <TypingInput
          onInput={handleInput}
          isFocused={isFocused && !showSummary}
          onFocusChange={setIsFocused}
        />

        <div className="mt-8 text-gray-500 text-sm">
          {isFinished ? "Session Complete!" : "Start typing to begin..."}
        </div>
      </div>

      <SummaryModal
        isOpen={showSummary}
        onClose={handleRestart}
        stats={metrics}
        keystrokes={keystrokes}
      />
    </div>
  );
}

export default App;
