let formRendered = false;
let ul = document.querySelector('#related-word-list');
let footerPhoto = document.querySelector('.footer-image');
let imageButton = document.querySelector('.button-on-image');
imageButton.style.display = 'none';
let form = document.querySelector('#form');
let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Function to handle letter button clicks
function handleLetterClick(letter) {
  const simulatedEvent = { key: letter }; // Simulate a keypress event
  handleKeyPress(simulatedEvent);
}

// Function to handle keypress events
function handleKeyPress(e) {
  if (e.target.tagName.toLowerCase() !== 'input') {
    if (letter.letter.toLowerCase() === e.key) {
      ul.style.display = 'flex';
      let relatedWords = letter.relatedWords;

      ul.innerHTML = '';

      relatedWords.forEach(word => {
        let li = document.createElement('li');
        li.innerText = word;
        li.className = 'related-words';

        let deleteIcon = document.createElement('span');
        deleteIcon.innerHTML = '&#10006;';
        deleteIcon.className = 'delete-button';

        li.appendChild(deleteIcon);
        ul.appendChild(li);
      });

      document.querySelector('#word-div').style.display = 'flex';
      document.querySelector('#display-letter').style.display = 'flex';
      document.querySelector('.button-on-image').style.display = 'flex';
      form.style.display = 'flex';

      let photo = document.querySelector('img');
      let word = document.querySelector('h3');
      let displayLetter = document.querySelector('.display-letter');

      photo.src = letter.photo;
      photo.alt = letter.photo;
      photo.title = letter.altText;
      word.innerText = letter.word;
      displayLetter.innerText = letter.letter;

      imageButton.addEventListener('click', () => {
        photo.src = letter.livePhoto;
        imageButton.style.display = 'none';
      });

      photo.addEventListener('mouseover', (e) => {
        let tooltipContent = photo.title;
        e.mouseover = tooltipContent;
      });

      ul.addEventListener('click', (e) => {
        if (e.target.className === 'delete-button') {
          let clickedElement = Array.from(e.target.parentElement.textContent);
          let clickedElementMinusX = clickedElement.slice(0, clickedElement.length - 1).toString();
          let newClickedElement = clickedElementMinusX.replace(/,/g, '');

          let filteredArray = relatedWords.filter(word => word !== newClickedElement);

          fetch(`https://alphabet-data.onrender.com/alphabet/${letter.id}`, {
            method: 'PATCH',
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({ relatedWords: filteredArray })
          })
            .then(response => response.json())
            .then(data => {
              e.target.parentElement.remove();
            });
        };
      });
    }
  }
}

// ...

// Existing keypress event listener
document.addEventListener('keypress', handleKeyPress);

// ...

// Function to check if the device is a mobile device
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

// Use touchstart event for mobile devices and keypress for others
const eventType = isMobileDevice() ? 'touchstart' : 'click';

// Modify your event listener to use the determined event type
document.addEventListener(eventType, function (event) {
  if (event.target.tagName.toLowerCase() === 'button' && event.target.textContent.length === 1) {
    handleLetterClick(event.target.textContent);
  }
});

// Call the function to generate letter buttons on page load
window.onload = generateLetterButtons;

