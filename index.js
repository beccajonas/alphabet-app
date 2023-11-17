// * To do: 
// * 1. Persist patch without refresh
// * 2. Remove selected element from relatedWords array on delete button click
// * 3. Prevent entire letter object being deleted if all relatedWords are array (see parent element?)

let formRendered = false;
let ul = document.querySelector('#related-word-list')
let footerPhoto = document.querySelector('.footer-image');
let imageButton = document.querySelector('.button-on-image');
imageButton.style.display = 'none';
let form = document.querySelector('#form')
let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let pageKeypress;

fetch("http://localhost:3000/alphabet")
    .then((res) => res.json())
    .then((data) => {
        formHandle(data)
        
        data.forEach(letter => {
            renderDisplay(letter);
            renderLetters(letter);

        });
    });

function renderLetters(letters) {
    let letterList = document.getElementById("list-of-letters");
    let letter = document.createElement('li');
    letter.textContent = letters.letter;
    letter.addEventListener('click', () => letter.style.textDecoration = "line-through");
    letterList.append(letter);
    }

function formHandle(letters) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        let wordSubmission = e.target[0].value
        let wordSubmissionFirstLetter = wordSubmission[0].toLowerCase()
        let wordSubmissionIndex = alphabet.indexOf(wordSubmissionFirstLetter).toString();
        let letterObj = letters[wordSubmissionIndex]

        if (!letterObj) {
            alert(`Oops! No letter found for '${wordSubmissionFirstLetter}'. Try again!`);
            return;
        }

        let letterId = letterObj.id
        let letterWordArray = letterObj.relatedWords

    fetch(`http://localhost:3000/alphabet/${letterId}`, {
        method: 'PATCH', 
        headers: {
            "content-type" : "application/JSON"
        },
        body: JSON.stringify ({ relatedWords : [...letterWordArray, wordSubmission] })
    })
    .then(response => response.json())
    .then(data => {   
        if (wordSubmissionFirstLetter.toLowerCase() === letterObj.letter.toLowerCase()) {
            let newWordLi = document.createElement('li');
            newWordLi.innerText = wordSubmission;
            newWordLi.className = 'related-words';

            let deleteIcon = document.createElement('span');
            deleteIcon.innerHTML = '&#10006;'; 
            deleteIcon.className = 'delete-button';

            newWordLi.appendChild(deleteIcon);
            ul.append(newWordLi);
            form.reset();
        }
        else {alert(`Oops! That doesn't start with '${data.letter.toLowerCase()}.' Try again!`)}
        })
    })
}

function renderDisplay(letter) {
    document.addEventListener('keypress', e => {    
        
        if (e.target.tagName.toLowerCase() !== 'input') {

            if (letter.letter.toLowerCase() === e.key) {
            
                ul.style.display = 'flex';
                let relatedWords = letter.relatedWords
                console.log(relatedWords);

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
                form.style.display = 'block';
                footerPhoto.style.display = 'flex';

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
            };
        };
    });
};

ul.addEventListener('click', (e) => {
    let firstLetter = e.target.parentElement.textContent[0].toLowerCase()
    let firstLetterIndex = alphabet.indexOf(firstLetter).toString();
        
    if(!e.target.classList.contains('delete-icon')) {
        let li = e.target.parentElement;
        li.remove()
    }
});

// let prompt = document.querySelector(".input")
// prompt.addEventListener('keypress', e => {
//     console.log('prompt keycode ' + e.key);
//     let promptKeypress = e.key;
// })

// document.addEventListener('keypress', e => {
//     if (e.target.tagName.toLowerCase() !== 'input') {
//         console.log('document keycode ' + e.key)
//     let pageKeypress = e.key;
//     }
// });

// console.log(promptKeypress, pageKeypress);