// app.js

const affirmations = [
    "You are the main character.",
    "Your energy is unmatched.",
    "You walk in and the room upgrades itself.",
    "You're unstoppable.",
    "Everything you touch turns to gold ✨",
    "You are a masterpiece in progress.",
    "You owe it to yourself to be your best self.",
    "Protect your peace. It's your superpower.",
    "You are glowing, inside and out.",
    "Do it for you.",
    "You are radiant and magnetic.",
    "The universe is working in your favor."
];

const compliments = [
    "Your aura is literally sparkling ✨",
    "You’re the IT girl.",
    "A literal icon.",
    "10/10, no notes.",
    "You make everything look effortless.",
    "Brains, beauty, and big boss energy.",
    "You're not just a snack, you're the whole meal.",
    "Your smile is contagious.",
    "You redefine perfection.",
    "In a world of trends, you are a classic."
];

const dailySongs = [
    "https://open.spotify.com/embed/track/779cR6b2QnS9L5Gj6O52l4?utm_source=generator&theme=0", // yes, and?
    "https://open.spotify.com/embed/track/39LLxExYz6ewLAcYrzQQyP?utm_source=generator&theme=0", // Levitating
    "https://open.spotify.com/embed/track/7iAgSqO7D6g9v76L1eN83V?utm_source=generator&theme=0", // Karma
    "https://open.spotify.com/embed/track/62P5u2Q6V1KqY64VpW3W4o?utm_source=generator&theme=0", // Kill Bill
    "https://open.spotify.com/embed/track/0qpeN1lEa35g51vYj1G1tF?utm_source=generator&theme=0", // Flowers
    "https://open.spotify.com/embed/track/564g10c3j1S3G9X910yQJp?utm_source=generator&theme=0", // Paint The Town Red
    "https://open.spotify.com/embed/track/1BxfuPKGuaZ2V54261x71F?utm_source=generator&theme=0"  // Cruel Summer
];

let lastAffirmation = "Click the button below to reveal your truth for the day.";
let savedAffirmations = JSON.parse(localStorage.getItem('savedAffirmations')) || [];

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

const btnAffirmation = document.getElementById('btn-affirmation');
const affirmationDisplay = document.getElementById('affirmation-display');
const btnSaveAffirmation = document.getElementById('btn-save-affirmation');
const savedList = document.getElementById('saved-affirmations');

const btnCompliment = document.getElementById('btn-compliment');
const complimentDisplay = document.getElementById('compliment-display');

const btnDailySong = document.getElementById('btn-daily-song');
const spotifyPlayer = document.getElementById('spotify-player');

const checkItems = document.querySelectorAll('.check-item input[type="checkbox"]');
const progressFill = document.getElementById('glow-progress');
const progressText = document.getElementById('progress-text');
const streakCount = document.getElementById('streak-count');

const scrollDownBtn = document.getElementById('scroll-down');

// Audio elements
const sparkleSound = document.getElementById('sparkle-sound');
const popSound = document.getElementById('pop-sound');

function playSound(audioEl) {
    if(!audioEl) return;
    audioEl.currentTime = 0;
    audioEl.play().catch(e => console.log('Audio play protected by browser'));
}

// 1. Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    body.className = savedTheme;
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('theme', 'dark-mode');
        updateThemeIcon('dark-mode');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('theme', 'light-mode');
        updateThemeIcon('light-mode');
    }
    playSound(popSound);
}

function updateThemeIcon(theme) {
    if(theme === 'dark-mode') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

themeToggle.addEventListener('click', toggleTheme);

// 2. Affirmations & Compliments
function animateText(element, text) {
    element.classList.remove('pulse-on-change');
    void element.offsetWidth; // trigger reflow
    element.innerText = text;
    element.classList.add('pulse-on-change');
}

btnAffirmation.addEventListener('click', () => {
    const random = affirmations[Math.floor(Math.random() * affirmations.length)];
    lastAffirmation = random;
    animateText(affirmationDisplay, random);
    
    // reset heart icon state
    if(savedAffirmations.includes(random)) {
        btnSaveAffirmation.classList.add('saved');
        btnSaveAffirmation.querySelector('i').className = 'fas fa-heart';
    } else {
        btnSaveAffirmation.classList.remove('saved');
        btnSaveAffirmation.querySelector('i').className = 'far fa-heart';
    }
    playSound(sparkleSound);
});

btnCompliment.addEventListener('click', () => {
    const random = compliments[Math.floor(Math.random() * compliments.length)];
    animateText(complimentDisplay, random);
    playSound(sparkleSound);
});

btnDailySong.addEventListener('click', () => {
    const randomSong = dailySongs[Math.floor(Math.random() * dailySongs.length)];
    
    spotifyPlayer.style.opacity = 0.5;
    setTimeout(() => {
        spotifyPlayer.src = randomSong;
        spotifyPlayer.style.opacity = 1;
    }, 300);

    playSound(sparkleSound);
    
    // Provide slight visual feedback
    const originalText = btnDailySong.innerHTML;
    btnDailySong.innerHTML = "Matched! 🎶";
    setTimeout(() => {
        btnDailySong.innerHTML = originalText;
    }, 1500);
});

// 3. Save feature
function renderSaved() {
    savedList.innerHTML = '';
    savedAffirmations.forEach((aff, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${aff}</span>
            <button class="btn-delete" title="Remove" onclick="removeAffirmation(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        savedList.appendChild(li);
    });
}

function removeAffirmation(index) {
    savedAffirmations.splice(index, 1);
    localStorage.setItem('savedAffirmations', JSON.stringify(savedAffirmations));
    renderSaved();
    playSound(popSound);
}

// Make globally available to inline onclick
window.removeAffirmation = removeAffirmation;

btnSaveAffirmation.addEventListener('click', () => {
    if (lastAffirmation === "Click the button below to reveal your truth for the day.") return;
    
    if (!savedAffirmations.includes(lastAffirmation)) {
        savedAffirmations.unshift(lastAffirmation);
        localStorage.setItem('savedAffirmations', JSON.stringify(savedAffirmations));
        renderSaved();
        
        btnSaveAffirmation.classList.add('saved');
        btnSaveAffirmation.querySelector('i').className = 'fas fa-heart';
        playSound(popSound);
    }
});

// 4. Glow-Up Tracker
function updateProgress() {
    const total = checkItems.length;
    const checked = document.querySelectorAll('.check-item input[type="checkbox"]:checked').length;
    const percentage = Math.round((checked / total) * 100);
    
    progressFill.style.width = `${percentage}%`;
    progressText.innerText = `${percentage}%`;

    // update streak logic
    if(percentage === 100) {
        if(localStorage.getItem('streakComplete') !== 'true') {
            let streak = parseInt(localStorage.getItem('streak') || 0);
            streak++;
            localStorage.setItem('streak', streak);
            localStorage.setItem('streakComplete', 'true');
            streakCount.innerText = streak;
            playSound(sparkleSound);
        }
    } else {
        localStorage.setItem('streakComplete', 'false');
    }
}

function initTracker() {
    // load streak
    streakCount.innerText = localStorage.getItem('streak') || 0;
    
    // load checkbox states from today
    const dateStr = new Date().toISOString().split('T')[0];
    const savedStates = JSON.parse(localStorage.getItem('tracker_' + dateStr)) || {};
    
    checkItems.forEach(item => {
        const key = item.getAttribute('data-key');
        if(savedStates[key]) {
            item.checked = true;
        }
        
        item.addEventListener('change', () => {
            playSound(popSound);
            saveTrackerState();
            updateProgress();
        });
    });
    
    updateProgress();
}

function saveTrackerState() {
    const dateStr = new Date().toISOString().split('T')[0];
    const state = {};
    checkItems.forEach(item => {
        const key = item.getAttribute('data-key');
        state[key] = item.checked;
    });
    localStorage.setItem('tracker_' + dateStr, JSON.stringify(state));
}

// 5. Scroll function
scrollDownBtn.addEventListener('click', () => {
    document.getElementById('affirmations').scrollIntoView({ behavior: 'smooth' });
    playSound(popSound);
});

// 6. Particles Generator
function createParticles() {
    const container = document.getElementById('particles-container');
    const emojis = ['✨', '💖', '⭐', '🦋'];
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Randomize
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        particle.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 10000);
    }, 800);
}

// Init all
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderSaved();
    initTracker();
    createParticles();
});
