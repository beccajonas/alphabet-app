let formRendered = false;
const letterColors = ['#241e4e', '#6FD08C', '#a3333d'];
const ul = document.querySelector('#related-word-list');
const imageButton = document.querySelector('.button-on-image');
imageButton.style.display = 'none';
const form = document.querySelector('#form');
const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

const fetchData = () => {
  fetch("https://alphabet-data.onrender.com/alphabet/")
    .then((response) => response.json())
    .then((data) => {
      formHandle(data);
      data.forEach((letter) => {
        renderDisplay(letter);
        renderLetters(letter);
      });
    });
};

const renderLetters = (letter) => {
  const letterList = document.getElementById("list-of-letters");
  const displayLetter = document.createElement('li');
  displayLetter.textContent = letter.letter;
  const randomColor = letterColors[Math.floor(Math.random() * letterColors.length)];
  displayLetter.style.color = randomColor;
  letterList.append(displayLetter);
  displayLetter.addEventListener('click', () => renderDisplayContent(letter));
};

const renderDisplayContent = (letter) => {
  ul.style.display = 'flex';
  const relatedWords = letter.relatedWords;

  ul.innerHTML = '';

  relatedWords.forEach(word => {
    const li = createLiElement(word);
    ul.appendChild(li);
  });

  showElements(letter);
};

const createLiElement = (word) => {
  const li = document.createElement('li');
  li.innerText = word;
  li.className = 'related-words';
  const deleteIcon = document.createElement('span');
  deleteIcon.innerHTML = '&#10006;';
  deleteIcon.className = 'delete-button';
  li.appendChild(deleteIcon);

  deleteIcon.addEventListener('click', () => handleDeleteClick(letter, word));

  return li;
};

const handleDeleteClick = (letter, word) => {
  const filteredArray = letter.relatedWords.filter(w => w !== word);
  updateRelatedWords(letter, filteredArray);
};

const updateRelatedWords = (letter, filteredArray) => {
  fetch(`https://alphabet-data.onrender.com/alphabet/${letter.id}`, {
    method: 'PATCH',
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ relatedWords: filteredArray })
  })
    .then(response => response.json())
    .then(() => ul.innerHTML = filteredArray.map(createLiElement));
};

const showElements = (letter) => {
  document.querySelector('#word-div').style.display = 'flex';
  document.querySelector('#display-letter').style.display = 'flex';
  imageButton.style.display = 'flex';
  form.style.display = 'flex';

  const photo = document.querySelector('img');
  const word = document.querySelector('h3');
  const displayLetter = document.querySelector('.display-letter');

  photo.src = letter.photo;
  photo.alt = letter.photo;
  photo.title = letter.altText;
  word.innerText = letter.word;
  displayLetter.innerText = letter.letter;

  imageButton.addEventListener('click', () => {
    photo.src = letter.livePhoto;
    imageButton.style.display = 'none';
  });

  photo.addEventListener('mouseover', (e) => e.mouseover = photo.title);
};

const formHandle = (letters) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const wordSubmission = e.target[0].value;
    const wordSubmissionFirstLetter = wordSubmission[0].toLowerCase();
    const wordSubmissionIndex = alphabet.indexOf(wordSubmissionFirstLetter).toString();
    const letterObj = letters[wordSubmissionIndex];

    if (!letterObj) {
      alert(`Oops! No letter found for '${wordSubmissionFirstLetter}'. Try again!`);
      return;
    }

    const letterId = letterObj.id;
    const letterWordArray = letterObj.relatedWords;

    fetch(`https://alphabet-data.onrender.com/alphabet/${letterId}`, {
      method: 'PATCH',
      headers: { "content-type": "application/JSON" },
      body: JSON.stringify({ relatedWords: [...letterWordArray, wordSubmission] })
    })
      .then(response => response.json())
      .then(data => {
        if (wordSubmissionFirstLetter.toLowerCase() === letterObj.letter.toLowerCase()) {
          ul.appendChild(createLiElement(wordSubmission));
          form.reset();
        } else {
          alert(`Oops! That doesn't start with '${data.letter.toLowerCase()}.' Try again!`);
        }
      });
  });
};

const renderDisplay = (letter) => {
  document.addEventListener('keypress', (e) => {
    if (e.target.tagName.toLowerCase() !== 'input') {
      if (letter.letter.toLowerCase() === e.key) {
        renderDisplayContent(letter);
        const letterList = document.getElementById("list-of-letters");
        const letters = letterList.getElementsByTagName('li');

        for (let i = 0; i < letters.length; i++) {
          const randomColor = letterColors[Math.floor(Math.random() * letterColors.length)];
          letters[i].style.color = randomColor;
      }
    }
  }}
)};

fetchData();
