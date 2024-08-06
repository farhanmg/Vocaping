const word1 = ["Ebullient", "Cheerful and full of energy.",
    [
        "Sarah's ebullient personality always brightened up the office.",
        "The ebullient crowd cheered wildly as the band took the stage.",
        "His ebullient laughter filled the room and made everyone smile.",
        "The children were ebullient after hearing about the surprise trip to the zoo.",
        "Despite the challenges, her ebullient spirit never wavered."
    ]
]
const word2 = ["Cognizant", "Having knowledge or awareness.",
    [
        "He was fully cognizant of the risks involved in the project.",
        "Being cognizant of cultural differences is important when traveling.",
        "The manager was cognizant of the team's hard work and dedication.",
        "She remained cognizant of the deadline as she worked on the report.",
        "The committee was cognizant of the need for transparency in their decisions."
    ]
]
const word3 = ["Ineffable", "Too great or extreme to be expressed in words.",
    [
        "The beauty of the sunset over the mountains was simply ineffable.",
        "Their ineffable joy at the birth of their child was evident to everyone.",
        "The artist tried to capture the ineffable emotions in his painting.",
        "She felt an ineffable connection to the place she called home.",
        "The ineffable sorrow of losing a loved one is hard to describe."
    ]
]
const word4 = ["Sanguine","Optimistic or positive, especially in a difficult situation.",
    [
        "Despite the economic downturn, he remained sanguine about the future.",
        "Her sanguine outlook helped her navigate through tough times.",
        "The team was sanguine about their chances of winning the championship.",
        "He gave a sanguine speech, inspiring confidence in his audience.",
        "Even in the face of adversity, she kept a sanguine attitude."
    ]
]
const word5 = ["Ephemeral", "Lasting for a very short time.",
    [
        "The beauty of the cherry blossoms is ephemeral, lasting only a few weeks.",
        "Their ephemeral romance was intense but short-lived.",
        "The artist captured the ephemeral nature of life in his work.",
        "The joy from winning the lottery proved to be ephemeral.",
        "She cherished the ephemeral moments of happiness in her daily life."
    ]
]

const words = [word1, word2, word3, word4, word5];


const wordName = document.querySelector(".word")
const definition = document.querySelector(".definition")
const sentence1 = document.querySelector(".Sentence1")
const sentence2 = document.querySelector(".Sentence2")
const sentence3 = document.querySelector(".Sentence3")
const sentence4 = document.querySelector(".Sentence4")
const sentence5 = document.querySelector(".Sentence5")

function displayWord(word) {
    wordName.innerHTML = word[0];
    definition.innerHTML = word[1];
    sentence1.innerHTML = word[2][0];
    sentence2.innerHTML = word[2][1];
    sentence3.innerHTML = word[2][2];
    sentence4.innerHTML = word[2][3];
    sentence5.innerHTML = word[2][4];
}

function showWordOfTheDay() {
    const today = new Date();
    const day = today.getDate();
    const index = (day - 1) % words.length;
    displayWord(words[index]);

     // Total 5
    // day ex: 24 -> 24%5 => 4
    
}

showWordOfTheDay();

let TIME_LIMIT = 60;
let quotes_array = words.flatMap(word => word[2]);
let timer_text = document.querySelector(".curr_time");
let accuracy_text = document.querySelector(".curr_accuracy");
let error_text = document.querySelector(".curr_errors");
let cpm_text = document.querySelector(".curr_cpm");
let wpm_text = document.querySelector(".curr_wpm");
let quote_text = document.querySelector(".quote");
let input_area = document.querySelector(".input_area");
let restart_btn = document.querySelector(".restart_btn");
let cpm_group = document.querySelector(".cpm");
let wpm_group = document.querySelector(".wpm");
let error_group = document.querySelector(".errors");
let accuracy_group = document.querySelector(".accuracy");

let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let total_errors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let current_quote = "";
let quoteNo = 0;
let timer = null;

// Prevent copy, cut, and paste in the input area
input_area.addEventListener('copy', (e) => {
    e.preventDefault();
})

input_area.addEventListener('cut', (e) => {
    e.preventDefault();
});

input_area.addEventListener('paste', (e) => {
    e.preventDefault();
});


function updateQuote() {
    current_quote = quotes_array[quoteNo];

    const quoteContainer = document.createElement('div');
    quoteContainer.classList.add('quoteContainer');

    current_quote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        quoteContainer.appendChild(charSpan);
    });

    quote_text.appendChild(quoteContainer);

    if (quoteNo < quotes_array.length - 1)
        quoteNo++;
    else
        quoteNo = 0;
}


function processCurrentText() {
    const curr_input = input_area.value;
    const curr_input_array = curr_input.split('');

    characterTyped++;
    errors = 0;

    const quoteContainers = quote_text.querySelectorAll('.quoteContainer');
    const currentQuoteContainer = quoteContainers[quoteContainers.length - 1];
    const quoteSpanArray = currentQuoteContainer.querySelectorAll('span');

    quoteSpanArray.forEach((char, index) => {
        let typedChar = curr_input_array[index];

        if (typedChar == null) {
            char.classList.remove('correct_char');
            char.classList.remove('incorrect_char');
        } else if (typedChar === char.innerText) {
            char.classList.add('correct_char');
            char.classList.remove('incorrect_char');
        } else {
            char.classList.add('incorrect_char');
            char.classList.remove('correct_char');
            errors++;
        }
    });

    error_text.textContent = total_errors + errors;

    let correctCharacters = (characterTyped - (total_errors + errors));
    let accuracyVal = ((correctCharacters / characterTyped) * 100);
    accuracy_text.textContent = Math.round(accuracyVal);

    // Update WPM and CPM
    let cpm = Math.round((characterTyped / timeElapsed) * 60);
    let wpm = Math.round(((characterTyped / 5) / timeElapsed) * 60);
    cpm_text.textContent = cpm;
    wpm_text.textContent = wpm;

    if (curr_input.length == current_quote.length) {
        input_area.value = "";
        total_errors += errors;
        updateQuote();
    }
}



function startGame() {
    resetValues();
    updateQuote();
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function resetValues() {
    timeLeft = TIME_LIMIT;
    timeElapsed = 0;
    errors = 0;
    total_errors = 0;
    accuracy = 0;
    characterTyped = 0;
    quoteNo = 0;
    input_area.disabled = false;
    input_area.value = "";
    quote_text.textContent = 'Click on the area below to start the game.';
    accuracy_text.textContent = 100;
    timer_text.textContent = timeLeft + 's';
    error_text.textContent = 0;
    // restart_btn.style.display = "none";
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeElapsed++;
        timer_text.textContent = timeLeft + "s";

        // Update WPM and CPM
        let cpm = Math.round((characterTyped / timeElapsed) * 60);
        let wpm = Math.round(((characterTyped / 5) / timeElapsed) * 60);
        cpm_text.textContent = cpm;
        wpm_text.textContent = wpm;
    } else {
        finishGame();
    }
}


function finishGame() {
    clearInterval(timer);
    input_area.disabled = true;
    quote_text.textContent = "Click on restart to start a new game.";
    restart_btn.style.display = "block";

    let cpm = Math.round((characterTyped / timeElapsed) * 60);
    let wpm = Math.round(((characterTyped / 5) / timeElapsed) * 60);
    cpm_text.textContent = cpm;
    wpm_text.textContent = wpm;
    cpm_group.style.display = "block";
    wpm_group.style.display = "block";
}

showWordOfTheDay();
