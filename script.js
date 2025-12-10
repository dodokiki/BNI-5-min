// Navigation Logic
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicator = document.querySelector('.slide-indicator');

let currentSlide = 0;
const totalSlides = slides.length;

function updateSlide() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });
    indicator.textContent = `${currentSlide + 1} / ${totalSlides}`;
    
    // Reset cue cards when entering or leaving slide 22 (index 21)
    if (currentSlide === 21) {
        resetCueCards(); // Reset when entering slide 22
    } else {
        resetCueCards(); // Also reset when leaving
    }
}

function nextSlide() {
    // Special handling for slide 22 (index 21) - show cue bubbles step by step
    if (currentSlide === 21) {
        const cueCards = document.querySelectorAll('.cue-card');
        if (currentCueStep < cueCards.length) {
            // Show next cue bubble
            cueCards[currentCueStep].classList.add('active');
            currentCueStep++;
            return; // Don't change slide yet
        }
        // All bubbles shown, now proceed to next slide
    }
    
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlide();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
    }
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Matrix/Digital Rain Background Effect
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = '0110101001010101BNIDIGITALAI';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#CF2030'; // BNI Red
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(draw, 33);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Touch Swipe Support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
}

// Digital Mouse Trail
const trailColors = ['#CF2030', '#ff4d5e', '#00f3ff', '#ffffff'];
const particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = trailColors[Math.floor(Math.random() * trailColors.length)];
        this.life = 1.0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.05;
        this.size -= 0.1;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.globalAlpha = this.life;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1.0;
    }
}

// Reuse the existing canvas if possible, or create a new layer.
// Since existing canvas has a specific matrix effect clearing it, let's mix them or use a separate overlay.
// To keep it simple and clean, let's create a separate canvas for the trail to avoid conflict with the matrix rain clearRect.
const trailCanvas = document.createElement('canvas');
trailCanvas.id = 'trail-canvas';
trailCanvas.style.position = 'absolute';
trailCanvas.style.top = '0';
trailCanvas.style.left = '0';
trailCanvas.style.width = '100%';
trailCanvas.style.height = '100%';
trailCanvas.style.pointerEvents = 'none'; // Click through
trailCanvas.style.zIndex = '999'; // On top of everything
document.body.appendChild(trailCanvas);

const trailCtx = trailCanvas.getContext('2d');
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
});

document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(e.x, e.y));
    }
});

function animateTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(trailCtx);
        if (particles[i].life <= 0 || particles[i].size <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateTrail);
}
animateTrail();

// Slide 9: Show cue bubbles step by step when clicking next button
let currentCueStep = 0;

function resetCueCards() {
    currentCueStep = 0;
    const cueCards = document.querySelectorAll('.cue-card');
    cueCards.forEach(card => {
        card.classList.remove('active');
    });
}
