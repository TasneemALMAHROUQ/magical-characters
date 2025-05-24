const charactersContainer = document.getElementById('characters-container');
const houseFilter = document.getElementById('house-filter');

const API_URL = 'https://hp-api.onrender.com/api/characters';

const NOT_FOUND_IMG = 'images/not-found.png';

let characters = [];

async function fetchCharacters() {
  try {
    const res = await fetch(API_URL);
    characters = await res.json();
    renderCharacters(characters.slice(0, 16)); 
  } catch (error) {
    charactersContainer.innerHTML = '<p>Failed to load data. Please try again.</p>';
  }
}

function renderCharacters(chars) {
  charactersContainer.innerHTML = '';
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

    charactersContainer.appendChild(card);
  });


  const characterCards = document.querySelectorAll('.character-card');
  characterCards.forEach(card => {
    card.addEventListener('click', () => {
      if(card.classList.contains('spin-animation')) return;
      card.classList.add('spin-animation');
      card.addEventListener('animationend', () => {
        card.classList.remove('spin-animation');
      }, { once: true });
    });
  });
}

function filterCharacters() {
  const selectedHouse = houseFilter.value;
  let filtered = characters;

  if (selectedHouse !== 'all') {
    filtered = characters.filter(char => char.house === selectedHouse);
  }

  renderCharacters(filtered.slice(0, 16));
}

houseFilter.addEventListener('change', filterCharacters);

fetchCharacters();
