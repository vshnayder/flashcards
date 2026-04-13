// Sample flashcard data
const initialFlashcards = [
    {
        id: 1,
        front: "What is React?",
        back: "A JavaScript library for building user interfaces, particularly web applications with interactive and dynamic content.",
    },
    {
        id: 2,
        front: "What is JSX?",
        back: "A syntax extension for JavaScript that allows you to write HTML-like code within JavaScript, commonly used with React.",
    },
    {
        id: 3,
        front: "What is a component in React?",
        back: "A reusable piece of code that returns JSX elements to be rendered to the page. Components can be functional or class-based.",
    },
    {
        id: 4,
        front: "What is useState?",
        back: "A React Hook that allows you to add state to functional components. It returns an array with the current state value and a setter function.",
    },
    {
        id: 5,
        front: "What is useEffect?",
        back: "A React Hook that lets you perform side effects in functional components, such as data fetching, subscriptions, or DOM manipulation.",
    },
    {
        id: 6,
        front: "What is props in React?",
        back: "Short for properties, props are read-only data passed from parent components to child components to customize their behavior or appearance.",
    },
    {
        id: 7,
        front: "What is the Virtual DOM?",
        back: "A JavaScript representation of the actual DOM kept in memory. React uses it to optimize rendering by comparing changes and updating only what's necessary.",
    },
    {
        id: 8,
        front: "What is Next.js?",
        back: "A React framework that provides features like server-side rendering, static site generation, and built-in routing for building production-ready applications.",
    },
];

// Application state
let flashcards = [...initialFlashcards];
let currentIndex = 0;
let isFlipped = false;
let isAnimating = false;

// DOM elements
const flashcard = document.getElementById("flashcard");
const cardType = document.getElementById("cardType");
const cardText = document.getElementById("cardText");
const progress = document.getElementById("progress");
const progressDots = document.getElementById("progressDots");
const flipBtn = document.getElementById("flipBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const restartBtn = document.getElementById("restartBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Initialize the app
function init() {
    updateCard();
    createProgressDots();
    updateNavigation();
}

// Update the current card display
function updateCard() {
    const currentCard = flashcards[currentIndex];
    cardType.textContent = isFlipped ? "Answer" : "Question";
    cardText.textContent = isFlipped ? currentCard.back : currentCard.front;
    progress.textContent = `Card ${currentIndex + 1} of ${flashcards.length}`;
    updateProgressDots();
}

// Create progress dots
function createProgressDots() {
    progressDots.innerHTML = "";
    flashcards.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = "dot";
        dot.setAttribute("aria-label", `Go to card ${index + 1}`);
        dot.addEventListener("click", () => goToCard(index));
        progressDots.appendChild(dot);
    });
}

// Update progress dots
function updateProgressDots() {
    const dots = progressDots.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
}

// Update navigation buttons
function updateNavigation() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === flashcards.length - 1;
}

// Flip the card
function flipCard() {
    if (isAnimating) return;

    isAnimating = true;
    flashcard.classList.add("animating");

    setTimeout(() => {
        isFlipped = !isFlipped;
        updateCard();
        flashcard.classList.remove("animating");
        isAnimating = false;
    }, 150);
}

// Navigate to next card
function nextCard() {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        isFlipped = false;
        updateCard();
        updateNavigation();
    }
}

// Navigate to previous card
function prevCard() {
    if (currentIndex > 0) {
        currentIndex--;
        isFlipped = false;
        updateCard();
        updateNavigation();
    }
}

// Go to specific card
function goToCard(index) {
    currentIndex = index;
    isFlipped = false;
    updateCard();
    updateNavigation();
}

// Shuffle cards
function shuffleCards() {
    flashcards = [...flashcards].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    isFlipped = false;
    updateCard();
    createProgressDots();
    updateNavigation();
}

// Restart to original order
function restart() {
    flashcards = [...initialFlashcards];
    currentIndex = 0;
    isFlipped = false;
    updateCard();
    createProgressDots();
    updateNavigation();
}

// Event listeners
if (flashcard) {
    flashcard.addEventListener("click", flipCard);
}
if (flipBtn) {
    flipBtn.addEventListener("click", flipCard);
}
if (shuffleBtn) {
    shuffleBtn.addEventListener("click", shuffleCards);
}
if (restartBtn) {
    restartBtn.addEventListener("click", restart);
}
if (prevBtn) {
    prevBtn.addEventListener("click", prevCard);
}
if (nextBtn) {
    nextBtn.addEventListener("click", nextCard);
}

// Keyboard navigation
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowLeft":
            prevCard();
            break;
        case "ArrowRight":
            nextCard();
            break;
        case " ":
            event.preventDefault();
            flipCard();
            break;
    }
});

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("flashcard")) {
        init();
    }
});