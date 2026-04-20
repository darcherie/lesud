// Puzzle Navigation System
// Shared across all puzzle pages

const PUZZLE_ORDER = [
    'mots-fleches',
    'sea-slug', 
    'sailing',
    'map-click',
    'memory-match',
    'riddle'
];

// Progress tracking
function getProgress() {
    return JSON.parse(localStorage.getItem('vincent-puzzle-progress') || '[]');
}

function saveProgress(puzzleId) {
    const progress = getProgress();
    if (!progress.includes(puzzleId)) {
        progress.push(puzzleId);
        localStorage.setItem('vincent-puzzle-progress', JSON.stringify(progress));
    }
}

function getNextPuzzle(currentPuzzleId) {
    const currentIndex = PUZZLE_ORDER.indexOf(currentPuzzleId);
    if (currentIndex === -1 || currentIndex >= PUZZLE_ORDER.length - 1) {
        return null;
    }
    return PUZZLE_ORDER[currentIndex + 1];
}

// Mark puzzle complete and redirect to waiting page
function markPuzzleComplete(puzzleId) {
    // Record completion time for timer
    localStorage.setItem(`puzzle-complete-${puzzleId}`, Date.now().toString());
    
    // Save progress
    saveProgress(puzzleId);
    
    // Redirect to waiting page with next puzzle info
    const nextPuzzle = getNextPuzzle(puzzleId);
    if (nextPuzzle) {
        setTimeout(() => {
            window.location.href = `waiting.html?from=${puzzleId}`;
        }, 2000);
    } else {
        // All done - go to gallery
        setTimeout(() => {
            window.location.href = '../gallery/index.html';
        }, 2000);
    }
}

// Check if can skip waiting (test mode)
function canBypassTimer() {
    const params = new URLSearchParams(window.location.search);
    return params.has('skipTimer') || params.has('test') || localStorage.getItem('testMode') === 'true';
}

// Enable test mode (call from console: enableTestMode())
function enableTestMode() {
    localStorage.setItem('testMode', 'true');
    console.log('✓ Test mode enabled - timers bypassed');
}

// Disable test mode
function disableTestMode() {
    localStorage.removeItem('testMode');
    console.log('✗ Test mode disabled - timers active');
}

// Reset all progress (for testing)
function resetProgress() {
    localStorage.removeItem('vincent-puzzle-progress');
    PUZZLE_ORDER.forEach(p => localStorage.removeItem(`puzzle-complete-${p}`));
    console.log('↺ Progress reset');
}