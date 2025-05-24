const charactersContainer = document.getElementById('characters-container');
const houseFilter = document.getElementById('house-filter');
const loadMoreBtn = document.getElementById('load-more-btn');

const API_URL = 'https://hp-api.onrender.com/api/characters';
const NOT_FOUND_IMG = 'images/not-found.png';

let characters = [];
let displayedCount = 0;      
const LOAD_COUNT = 8;        


async function fetchCharacters() {
  try {
    const res = await fetch(API_URL);
    characters = await res.json();
    displayedCount = 0;
    renderCharacters(characters.slice(0, LOAD_COUNT));
    displayedCount = LOAD_COUNT;
    toggleLoadMoreBtn();
  } catch (error) {
    charactersContainer.innerHTML = '<p>Failed to load data. Please try again.</p>';
  }
}

function renderCharacters(chars) {

  chars.forEach(char => {
    const imgSrc = char.image ? char.image : NOT_FOUND_IMG;
    const card = document.createElement('div');
    card.className = 'character-card';

    card.innerHTML = `
      <img src="${imgSrc}" alt="${char.name}" />
      <h3>${char.name}</h3>
      <p><strong>House:</strong> ${char.house || 'Unknown'}</p>
      <p><strong>Date of Birth:</strong> ${char.dateOfBirth || 'Unknown'}</p>
    `;

    
    card.addEventListener('click', () => {
      if (card.classList.contains('spin-animation')) return;
      card.classList.add('spin-animation');
      card.addEventListener('animationend', () => {
        card.classList.remove('spin-animation');
      }, { once: true });
    });

    charactersContainer.appendChild(card);
  });
}

function toggleLoadMoreBtn() {
  if (displayedCount < characters.length) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

function loadMoreCharacters() {
  const selectedHouse = houseFilter.value;
  let filtered = characters;

  if (selectedHouse !== 'all') {
    filtered = characters.filter(char => char.house === selectedHouse);
  }

  const nextBatch = filtered.slice(displayedCount, displayedCount + LOAD_COUNT);
  renderCharacters(nextBatch);
  displayedCount += nextBatch.length;
  toggleLoadMoreBtn();
}


function filterCharacters() {
  const selectedHouse = houseFilter.value;
  let filtered = characters;

  if (selectedHouse !== 'all') {
    filtered = characters.filter(char => char.house === selectedHouse);
  }

  charactersContainer.innerHTML = '';
  displayedCount = 0;

  const initialBatch = filtered.slice(0, LOAD_COUNT);
  renderCharacters(initialBatch);
  displayedCount = initialBatch.length;
  toggleLoadMoreBtn();
}

houseFilter.addEventListener('change', filterCharacters);
loadMoreBtn.addEventListener('click', loadMoreCharacters);

fetchCharacters();
