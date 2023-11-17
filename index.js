let formRendered = false;
let ul = document.querySelector('#related-word-list')
let footerPhoto = document.querySelector('.footer-image');
let imageButton = document.querySelector('.button-on-image');
imageButton.style.display = 'none';
let form = document.querySelector('#form')
let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];



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
        console.log(wordSubmissionIndex);
        let letterObj = letters[wordSubmissionIndex]
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
    .then(data => {console.log(data)
        let newWordLi = document.createElement('li');
        newWordLi.innerText = wordSubmission;
        newWordLi.className = 'related-words';
        ul.append(newWordLi);
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

                relatedWords.forEach(word => {
                    let li = document.createElement('li')
                    li.innerText = word
                    li.className = 'related-words'
                    ul.appendChild(li)
                })

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
