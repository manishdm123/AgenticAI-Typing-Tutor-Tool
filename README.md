# Vibe Typing Tool

A modern, aesthetic typing tutor built with React, TypeScript, and TailwindCSS. It features real-time metrics, a "vibe feedback" system, and detailed error analysis.

# Phase1: Build the Core Typing Tool
## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.
2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the App

Start the development server:
```bash
npm run dev
```
Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Building for Production

To build the app for production:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## How It Works

The **Vibe Typing Tool** is a client-side React application that runs entirely in your browser. Here is a breakdown of the core mechanics:

### 1. The "Invisible Input" Trick
The most important part of the architecture is how we capture typing without a visible text box.
*   **Component**: `TypingInput.tsx`
*   **Mechanism**: There is a real HTML `<input>` element, but it has `opacity: 0` and is positioned absolutely.
*   **Focus Management**: When you click anywhere on the typing area, we programmatically `.focus()` this invisible input. This ensures we capture all native keyboard events (including Backspace and mobile keyboards) without showing an ugly text box.

### 2. The Game Loop (Data Flow)
The app follows a unidirectional data flow, primarily managed by two custom hooks:

**A. Capturing Input (`useKeystrokes.ts`)**
*   Listens to the invisible input.
*   On every keypress, it records a **Keystroke Object**:
    ```typescript
    {
      key: "a",
      expected: "a",
      correct: true,
      timestamp: 1715000000, // High-precision performance.now()
      latency: 120 // ms since last keypress
    }
    ```
*   It maintains the `input` string (what you see on screen) and the `keystrokes` array (the history used for stats).

**B. Calculating Stats (`useMetrics.ts`)**
*   This hook watches the `keystrokes` array.
*   **WPM**: Calculated as `(correctChars / 5) / elapsedMinutes`.
*   **Accuracy**: `correctKeys / totalKeys`.
*   **Hesitations**: Counts how many keystrokes had a `latency > 300ms`.

### 3. Visual Rendering
*   **`ReferenceText.tsx`**: This is the main display. It takes the target text and splits it into characters. It compares each character index with your `input` string to decide the color:
    *   **Green**: Correct.
    *   **Red**: Incorrect.
    *   **Yellow**: Current cursor position.
    *   **Grey**: Untyped.
*   **`VibeLayer.tsx`**: This is a purely visual layer that sits in the background. It watches *only* the very last keystroke.
    *   If `correct === false` -> Triggers "Shake Red".
    *   If `latency > 300ms` -> Triggers "Glow Yellow".
    *   If `streak > 0 && streak % 5 === 0` -> Triggers "Pulse Blue".

### 4. Session End
When `input.length` equals the `referenceText.length`:
1.  The game loop ends.
2.  The `SummaryModal` opens.
3.  We generate the **Heatmap** by grouping all the stored `keystrokes` by key (e.g., all "A" presses) and calculating the error rate for each specific key to color-code the keyboard grid.
