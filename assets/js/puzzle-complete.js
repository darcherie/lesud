// Puzzle Completion System
// Handles victory screens, letter collection, and return to port

const PUZZLE_NAMES = {
    'mots-fleches': 'Mots Fléchés',
    'memory-match': 'Mémoire',
    'sea-slug': 'Bave de Mer',
    'sailing': 'Voile',
    'notre-dame-lights': 'Lumière'
};

// Letters to collect (one per puzzle)
const LETTERS = ['V', 'I', 'N', 'C', 'E', 'N', 'T', '!'];
const PUZZLE_LETTERS = {
    'mots-fleches': 'V',
    'memory-match': 'I',
    'sea-slug': 'N',
    'sailing': 'C',
    'notre-dame-lights': 'E'
};

function getCompletedPuzzles() {
    const stored = localStorage.getItem('vincent-completed');
    return stored ? JSON.parse(stored) : [];
}

function saveCompletedPuzzle(puzzleId) {
    const completed = getCompletedPuzzles();
    if (!completed.includes(puzzleId)) {
        completed.push(puzzleId);
        localStorage.setItem('vincent-completed', JSON.stringify(completed));
    }
}

function getCollectedLetters() {
    const completed = getCompletedPuzzles();
    return completed.map(id => PUZZLE_LETTERS[id]).filter(Boolean);
}

function isPuzzleCompleted(puzzleId) {
    return getCompletedPuzzles().includes(puzzleId);
}

function isFirstPuzzleCompleted() {
    return getCompletedPuzzles().length === 1;
}

function showCompletionScreen(puzzleId) {
    const isFirst = getCompletedPuzzles().length === 0;
    const letter = PUZZLE_LETTERS[puzzleId] || '?';
    
    saveCompletedPuzzle(puzzleId);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
        <div class="completion-dialog">
            <div class="vincent-sprite-small">
                <img src="../assets/images/vincent-sprite.png" alt="Vincent">
            </div>
            <div class="dialogue-box">
                <p class="dialogue-text">${isFirst ? "J'ai gagné wahoo ! Et j'ai trouvé une lettre..." : "J'ai gagné wahoo ! Et j'ai trouvé encore une lettre !"}</p>
                <p class="letter-found">Lettre trouvée: <span class="letter">${letter}</span></p>
            </div>
            <button class="retour-btn" onclick="returnToPort()">Retourner au port</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

function showAlreadyCompletedDialog(puzzleId, onReplay, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
        <div class="completion-dialog">
            <div class="vincent-sprite-small">
                <img src="../assets/images/vincent-sprite.png" alt="Vincent">
            </div>
            <div class="dialogue-box">
                <p class="dialogue-text">J'ai déjà complété ce défi, est-ce que je veux rejouer ?</p>
            </div>
            <div class="choice-buttons">
                <button class="choice-btn oui" onclick="handleReplay()">Oui</button>
                <button class="choice-btn non" onclick="handleCancel()">Non</button>
            </div>
        </div>
    `;
    
    window.handleReplay = () => {
        overlay.remove();
        if (onReplay) onReplay();
    };
    
    window.handleCancel = () => {
        overlay.remove();
        if (onCancel) onCancel();
    };
    
    document.body.appendChild(overlay);
}

function returnToPort() {
    window.location.href = '../index.html?from=puzzle';
}

// Debug: Press 'D' to test completion screen
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'd' && e.ctrlKey) {
        console.log('Debug: Showing completion screen');
        showCompletionScreen('mots-fleches');
    }
});

// Call this when puzzle is won
function onPuzzleWin(puzzleId) {
    if (isPuzzleCompleted(puzzleId)) {
        showAlreadyCompletedDialog(puzzleId);
    } else {
        showCompletionScreen(puzzleId);
    }
}