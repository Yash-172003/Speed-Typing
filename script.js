const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay")
const quoteAuthorElement = document.getElementById("quoteAuthor")
const quoteInputElement = document.getElementById("quoteInput")
const timerElement = document.getElementById("timer")
const btnNextElement = document.getElementById("btnNext")
 
let myTime
let totalKeysPress = 0
let correctKeysPress
let incorrectKeysPress
let timerInterval; // Declare the timerInterval variable outside the startTimer function
let timerStarted = false; // New variable to track if timer has started

let correct = true;

document.getElementById("quoteInput").onkeydown = function(e){    
    if (!(e.key === "Shift" || e.key === "Backspace")) {
        totalKeysPress ++;
        if (!timerStarted) { // Start the timer only if it hasn't started yet
            startTimer();
            timerStarted = true; // Update the flag
        }
    }
}

quoteInputElement.addEventListener('input', () => {
    correctKeysPress = 0
    incorrectKeysPress = 0
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const arrayValue = quoteInputElement.value.split('')
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]
        if (character == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false;
        } else if (character === characterSpan.innerText) {
            correctKeysPress ++
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
            correct = true;
        } else {
            incorrectKeysPress ++
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false;
        }
    })

    if(correct) {
        showTime();
    }
})

function showTime(){
    quoteDisplayElement.innerText = "Your time: " + myTime + "s.\n" +
    "Total keys press = " + totalKeysPress + "\n" +
    "Correct keys press = " + correctKeysPress + "\n" +
    "Incorrect keys press = " + (totalKeysPress - correctKeysPress) + "\n" +
    "% Accuracy = " + ((correctKeysPress * 100 ) / totalKeysPress).toFixed(2) + " %" 
    quoteAuthorElement.innerText = ""
    quoteInputElement.style.display = "none"
    timerElement.style.visibility = "hidden"
    totalKeysPress = 0
    correctKeysPress = 0
    incorrectKeysPress = 0
    timerStarted = false; // Reset timerStarted flag
    clearInterval(timerInterval); // Stop the timer
}

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data);
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerText = '' //quote.content;
    quoteAuthorElement.innerText = quote.author;
    quote.content.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
    quoteInputElement.value = null;
    quoteInputElement.style.display = "block"
    timerElement.style.visibility = "visible"
}

let startTime 
function startTimer(){
    timerElement.innerText = 0
    startTime = new Date()
    timerInterval = setInterval(() => { // Assign the setInterval to timerInterval
        timerElement.innerText = getTimerTime()
        myTime = getTimerTime()
    }, 1000);
}

function getTimerTime(){
    return Math.floor((new Date() - startTime) / 1000)
}

function nextQuote(){
    showTime(); // Show time for the current quote
    renderNewQuote(); // Render the new quote
}

renderNewQuote();
