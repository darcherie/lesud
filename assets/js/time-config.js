// Time Lock Configuration
// Customize delays (in minutes) and personal notes between puzzles

const PUZZLE_CONFIG = [
    {
        id: 'mots-fleches',
        title: 'Mots Fléchés',
        delayMinutes: 0, // First puzzle - no delay
        note: "Bienvenue à ton chasse au trésor d'anniversaire ! Chaque énigme te rapproche de quelque chose de spécial... Mais "
    },
    {
        id: 'sea-slug',
        title: 'L\'Invasion des Limaces',
        // Random delay between 110-140 minutes (roughly 2 hours)
        delayMinutes: { min: 110, max: 140 },
        note: "Tu as trouvé les mots. Maintenant, il faut esquiver les baisers des limaces de mer... Tu comprends pourquoi. 💋"
    },
    {
        id: 'sailing',
        title: 'Contre le Mistral',
        delayMinutes: { min: 80, max: 110 },
        note: "Le vent souffle du nord. Tack contre le mistral pour retourner au port..."
    },
    {
        id: 'map-click',
        title: 'Lieu Secret',
        // Random delay between 80-110 minutes
        delayMinutes: { min: 50, max: 75 },
        note: "Tu as survécu ! Maintenant, souviens-toi... Où étions-nous ce soir-là ?"
    },
    {
        id: 'memory-match',
        title: 'Mémoire',
        // Random delay between 50-75 minutes
        delayMinutes: { min: 25, max: 45 },
        note: "Tu te souviens de l'endroit. Maintenant, teste ta mémoire sur nous..."
    },
    {
        id: 'riddle',
        title: 'La Dernière Énigme',
        // Random delay between 25-45 minutes
        delayMinutes: { min: 15, max: 30 },
        note: "Une dernière chose à prouver. Montre-moi que c'est vraiment toi..."
    },
    {
        id: 'gallery',
        title: 'La Galerie',
        delayMinutes: 0,
        note: "Tu as tout trouvé. Tu as prouvé que c'est toi. Maintenant, regarde ce que j'ai fait pour toi. Joyeux anniversaire, mon amour. 💜"
    }
];

// Testing bypass: add ?skipTimer=true to any URL to skip waiting
function canBypassTimer() {
    const params = new URLSearchParams(window.location.search);
    return params.has('skipTimer') || params.has('test') || localStorage.getItem('testMode') === 'true';
}

// Enable test mode for session
function enableTestMode() {
    localStorage.setItem('testMode', 'true');
    console.log('Test mode enabled - timers will be bypassed');
}

// Get delay for next puzzle (in milliseconds)
function getNextPuzzleDelay(currentPuzzleId) {
    const currentIndex = PUZZLE_CONFIG.findIndex(p => p.id === currentPuzzleId);
    if (currentIndex === -1 || currentIndex >= PUZZLE_CONFIG.length - 1) return 0;
    
    const nextConfig = PUZZLE_CONFIG[currentIndex + 1];
    const delay = nextConfig.delayMinutes;
    
    if (delay === 0) return 0;
    
    if (typeof delay === 'object') {
        // Random delay between min and max
        const randomMinutes = delay.min + Math.random() * (delay.max - delay.min);
        return randomMinutes * 60 * 1000; // Convert to milliseconds
    }
    
    return delay * 60 * 1000;
}

// Format time remaining for display
function formatTimeRemaining(ms) {
    if (ms <= 0) return "Maintenant !";
    
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    
    if (hours > 0) {
        return `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
        return `${minutes}min ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

// Get note for puzzle
function getPuzzleNote(puzzleId) {
    const config = PUZZLE_CONFIG.find(p => p.id === puzzleId);
    return config ? config.note : "...";
}

// Get title for puzzle
function getPuzzleTitle(puzzleId) {
    const config = PUZZLE_CONFIG.find(p => p.id === puzzleId);
    return config ? config.title : "Énigme suivante";
}