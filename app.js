// ===== Flashcard Data =====
const flashcardsData = {
  animals: [
    { word: 'Cat', image: '/images/cat.jpg', color: 'green' },
    { word: 'Dog', image: '/images/dog.jpg', color: 'blue' },
    { word: 'Elephant', image: '/images/elephant.jpg', color: 'yellow' },
    { word: 'Lion', image: '/images/lion.jpg', color: 'orange' }
  ],
  fruits: [
    { word: 'Apple', image: '/images/apple.jpg', color: 'red' },
    { word: 'Banana', image: '/images/banana.jpg', color: 'yellow' },
    { word: 'Orange', image: '/images/orange.jpg', color: 'orange' },
    { word: 'Strawberry', image: '/images/strawberry.jpg', color: 'pink' }
  ],
  family: [
    { word: 'Mom', image: '/images/mom.jpg', color: 'pink' },
    { word: 'Dad', image: '/images/dad.jpg', color: 'blue' },
    { word: 'Sister', image: '/images/sister.jpg', color: 'purple' }
  ],
  body: [
    { word: 'Hand', image: '/images/hand.jpg', color: 'amber' },
    { word: 'Eye', image: '/images/eye.jpg', color: 'cyan' },
    { word: 'Nose', image: '/images/nose.jpg', color: 'rose' }
  ],
  transport: [
    { word: 'Car', image: '/images/car.jpg', color: 'red' },
    { word: 'Bus', image: '/images/bus.jpg', color: 'yellow' },
    { word: 'Airplane', image: '/images/airplane.jpg', color: 'sky' }
  ],
  professions: [
    { word: 'Doctor', image: '/images/doctor.jpg', color: 'teal' },
    { word: 'Teacher', image: '/images/teacher.jpg', color: 'indigo' },
    { word: 'Firefighter', image: '/images/firefighter.jpg', color: 'red' }
  ]
};

const categoryNames = {
  animals: 'Animals',
  fruits: 'Fruits',
  family: 'Family',
  body: 'Body Parts',
  transport: 'Transportation',
  professions: 'Professions'
};

// ===== State =====
let currentCategory = 'animals';
let currentIndex = 0;
let cards = [...flashcardsData.animals];
let originalOrder = [...flashcardsData.animals];
let isGridView = false;
let currentPage = 1;
const cardsPerPage = 6;

// ===== DOM Elements =====
const categoryTabs = document.querySelectorAll('.category-tab');
const shuffleBtn = document.getElementById('shuffleBtn');
const sortBtn = document.getElementById('sortBtn');
const resetBtn = document.getElementById('resetBtn');
const singleViewBtn = document.getElementById('singleViewBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const singleView = document.getElementById('singleView');
const gridView = document.getElementById('gridView');
const cardNavigation = document.getElementById('cardNavigation');
const currentCard = document.getElementById('currentCard');
const cardImage = document.getElementById('cardImage');
const cardWord = document.getElementById('cardWord');
const cardBackWord = document.getElementById('cardBackWord');
const cardBackCategory = document.getElementById('cardBackCategory');
const cardCounter = document.getElementById('cardCounter');
const cardDots = document.getElementById('cardDots');
const cardGrid = document.getElementById('cardGrid');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// ===== Functions =====
function updateSingleCard() {
  const card = cards[currentIndex];
  if (!card) return;

  // Update card content
  cardImage.src = card.image;
  cardImage.alt = card.word;
  cardWord.textContent = card.word;
  cardBackWord.textContent = card.word;
  cardBackCategory.textContent = categoryNames[currentCategory];

  // Update colors
  const cardFront = currentCard.querySelector('.card-front');
  const cardBack = currentCard.querySelector('.card-back');
  cardFront.setAttribute('data-color', card.color);
  cardBack.setAttribute('data-color', card.color);

  // Reset flip state
  currentCard.classList.remove('flipped');

  // Update counter
  cardCounter.textContent = `${currentIndex + 1} / ${cards.length}`;

  // Update dots
  updateDots();

  // Update nav buttons
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === cards.length - 1;
}

function updateDots() {
  cardDots.innerHTML = '';
  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `card-dot ${index === currentIndex ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to card ${index + 1}`);
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSingleCard();
    });
    cardDots.appendChild(dot);
  });
}

function updateGridView() {
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const pageCards = cards.slice(startIndex, endIndex);

  // Render cards
  cardGrid.innerHTML = '';
  pageCards.forEach((card, index) => {
    const cardElement = createGridCard(card, startIndex + index);
    cardGrid.appendChild(cardElement);
  });

  // Render pagination
  renderPagination(totalPages);
}

function createGridCard(card, index) {
  const div = document.createElement('div');
  div.className = 'grid-card';
  div.innerHTML = `
    <div class="card-inner">
      <div class="card-front" data-color="${card.color}">
        <img src="${card.image}" alt="${card.word}" class="card-image">
        <h2 class="card-word">${card.word}</h2>
      </div>
      <div class="card-back" data-color="${card.color}">
        <div class="card-back-content">
          <span class="card-back-label">This is a</span>
          <h2 class="card-back-word">${card.word}</h2>
          <span class="card-back-category">${categoryNames[currentCategory]}</span>
        </div>
      </div>
    </div>
  `;
  div.addEventListener('click', () => {
    div.classList.toggle('flipped');
  });
  return div;
}

function renderPagination(totalPages) {
  pagination.innerHTML = '';

  if (totalPages <= 1) return;

  // Previous button
  const prevPageBtn = document.createElement('button');
  prevPageBtn.className = 'page-btn';
  prevPageBtn.disabled = currentPage === 1;
  prevPageBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateGridView();
    }
  });
  pagination.appendChild(prevPageBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      updateGridView();
    });
    pagination.appendChild(pageBtn);
  }

  // Next button
  const nextPageBtn = document.createElement('button');
  nextPageBtn.className = 'page-btn';
  nextPageBtn.disabled = currentPage === totalPages;
  nextPageBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateGridView();
    }
  });
  pagination.appendChild(nextPageBtn);
}

function switchCategory(category) {
  currentCategory = category;
  cards = [...flashcardsData[category]];
  originalOrder = [...flashcardsData[category]];
  currentIndex = 0;
  currentPage = 1;

  // Update active tab
  categoryTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });

  // Update view
  if (isGridView) {
    updateGridView();
  } else {
    updateSingleCard();
  }
}

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  currentIndex = 0;
  currentPage = 1;

  if (isGridView) {
    updateGridView();
  } else {
    updateSingleCard();
  }
}

function sortCards() {
  cards.sort((a, b) => a.word.localeCompare(b.word));
  currentIndex = 0;
  currentPage = 1;

  if (isGridView) {
    updateGridView();
  } else {
    updateSingleCard();
  }
}

function resetCards() {
  cards = [...originalOrder];
  currentIndex = 0;
  currentPage = 1;

  if (isGridView) {
    updateGridView();
  } else {
    updateSingleCard();
  }
}

function toggleView(gridMode) {
  isGridView = gridMode;

  singleViewBtn.classList.toggle('active', !isGridView);
  gridViewBtn.classList.toggle('active', isGridView);

  if (isGridView) {
    singleView.classList.add('hidden');
    cardNavigation.classList.add('hidden');
    gridView.classList.remove('hidden');
    updateGridView();
  } else {
    singleView.classList.remove('hidden');
    cardNavigation.classList.remove('hidden');
    gridView.classList.add('hidden');
    updateSingleCard();
  }
}

function goToPrevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    updateSingleCard();
  }
}

function goToNextCard() {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    updateSingleCard();
  }
}

function flipCurrentCard() {
  currentCard.classList.toggle('flipped');
}

// ===== Event Listeners =====
categoryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchCategory(tab.dataset.category);
  });
});

shuffleBtn.addEventListener('click', shuffleCards);
sortBtn.addEventListener('click', sortCards);
resetBtn.addEventListener('click', resetCards);

singleViewBtn.addEventListener('click', () => toggleView(false));
gridViewBtn.addEventListener('click', () => toggleView(true));

prevBtn.addEventListener('click', goToPrevCard);
nextBtn.addEventListener('click', goToNextCard);

currentCard.addEventListener('click', flipCurrentCard);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (isGridView) return;

  switch (e.key) {
    case 'ArrowLeft':
      goToPrevCard();
      break;
    case 'ArrowRight':
      goToNextCard();
      break;
    case ' ':
      e.preventDefault();
      flipCurrentCard();
      break;
  }
});

// ===== Initialize =====
updateSingleCard();
