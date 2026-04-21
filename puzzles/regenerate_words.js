const fs = require('fs');

// Read and parse grid_answers.csv
const gridContent = fs.readFileSync('grid_answers.csv', 'utf-8');
const gridLines = gridContent.trim().split('\n');
const grid = gridLines.map(line => line.split(','));

// Read and parse grid_clues.csv
const cluesContent = fs.readFileSync('grid_clues.csv', 'utf-8');
const cluesLines = cluesContent.trim().split('\n').slice(1); // Skip header
const cluesMap = {};

cluesLines.forEach(line => {
    // Handle quoted clues with commas and quotes inside
    let word, clue;
    if (line.startsWith('"')) {
        // Word is quoted
        const endQuote = line.indexOf('",');
        if (endQuote !== -1) {
            word = line.substring(1, endQuote);
            clue = line.substring(endQuote + 2).replace(/^"|"$/g, '');
        }
    } else {
        const commaIdx = line.indexOf(',');
        if (commaIdx !== -1) {
            word = line.substring(0, commaIdx);
            clue = line.substring(commaIdx + 1).replace(/^"|"$/g, '');
        }
    }
    if (word && clue) {
        cluesMap[word.trim()] = clue.trim();
    }
});

const ROWS = grid.length;
const COLS = grid[0].length;

// Find all horizontal words
function findHorizontalWords() {
    const words = [];
    for (let row = 0; row < ROWS; row++) {
        let word = '';
        let startCol = -1;
        for (let col = 0; col < COLS; col++) {
            const cell = grid[row][col]?.trim();
            if (cell && cell !== '') {
                if (word === '') startCol = col;
                word += cell;
            } else {
                if (word.length > 1) {
                    words.push({ word, startRow: row, startCol, direction: 'horizontal' });
                }
                word = '';
                startCol = -1;
            }
        }
        if (word.length > 1) {
            words.push({ word, startRow: row, startCol, direction: 'horizontal' });
        }
    }
    return words;
}

// Find all vertical words
function findVerticalWords() {
    const words = [];
    for (let col = 0; col < COLS; col++) {
        let word = '';
        let startRow = -1;
        for (let row = 0; row < ROWS; row++) {
            const cell = grid[row][col]?.trim();
            if (cell && cell !== '') {
                if (word === '') startRow = row;
                word += cell;
            } else {
                if (word.length > 1) {
                    words.push({ word, startRow, startCol: col, direction: 'vertical' });
                }
                word = '';
                startRow = -1;
            }
        }
        if (word.length > 1) {
            words.push({ word, startRow, startCol: col, direction: 'vertical' });
        }
    }
    return words;
}

const horizontalWords = findHorizontalWords();
const verticalWords = findVerticalWords();
const allWords = [...horizontalWords, ...verticalWords];

// Assign clue numbers
const startPositions = new Map();
allWords.forEach(w => {
    const key = `${w.startRow}-${w.startCol}`;
    if (!startPositions.has(key)) {
        startPositions.set(key, allWords.filter(ww => ww.startRow === w.startRow && ww.startCol === w.startCol)[0]);
    }
});

const sortedPositions = [...startPositions.keys()].sort((a, b) => {
    const [ar, ac] = a.split('-').map(Number);
    const [br, bc] = b.split('-').map(Number);
    return ar !== br ? ar - br : ac - bc;
});

const clueNumbers = {};
sortedPositions.forEach((key, idx) => {
    clueNumbers[key] = idx + 1;
});

// Escape single quotes for JS
function escapeClue(clue) {
    return clue.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Generate WORDS array
const WORDS = allWords.map(w => {
    const key = `${w.startRow}-${w.startCol}`;
    const clue = cluesMap[w.word] || `TODO: clue for ${w.word}`;
    return `            { word: '${w.word}', direction: '${w.direction}', startRow: ${w.startRow}, startCol: ${w.startCol}, clue: '${escapeClue(clue)}' }`;
});

console.log('        const WORDS = [');
console.log(WORDS.join(',\n'));
console.log('        ];');

// Stats
const missing = allWords.filter(w => !cluesMap[w.word]);
if (missing.length > 0) {
    console.log('\n// MISSING CLUES:');
    missing.forEach(w => console.log(`//   ${w.word}`));
}
