'use strict';

let isCardFlipped = false;
let isBoardBlocked = false;
let firstCard, secondCard;
let guessedCardPairs = 0;

const cards = document.querySelectorAll('.card');
const uniqueOrder = getUniqueNumbers();

const timer = document.querySelector('#timer');
timer.textContent = 60;

const timerId = setInterval(
    function() {
        timer.textContent--;
        if (+timer.textContent === 0) {
            resetGame(timerId);
        };
    }, 1000
);

function cardFlip() {
    if (isBoardBlocked) return;
    if (this === firstCard) return;

    this.classList.add('card_flipped');

    if (!isCardFlipped) {
        isCardFlipped = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    isBoardBlocked = true;
    matchCards();
}

function matchCards() {
    const isMatched = firstCard.dataset.pokemon === secondCard.dataset.pokemon;
    isMatched ? diableCards() : unflipCards();
}

function diableCards() {
    firstCard.removeEventListener('click', cardFlip);
    secondCard.removeEventListener('click', cardFlip);
    resetBoard();
    isWin();
}

function unflipCards() {
    shuffle();
    setTimeout(
        function() {
            firstCard.classList.remove('card_flipped');
            secondCard.classList.remove('card_flipped');
            resetBoard();
        }, 500
    )
}

function resetBoard() {
    isCardFlipped = false;
    isBoardBlocked = false;
    firstCard = null;
    secondCard = null;
}

function isWin() {
    guessedCardPairs++;
    if (guessedCardPairs == cards.length / 2) {
        setTimeout(
            function() {
                clearInterval(timerId);
                alert("You win");
            },
            500
        );
    }
}

function shuffle() {
    const notGuessedCards = document.querySelectorAll('div.card:not(.card_flipped)');
    notGuessedCards.forEach(function(card) {
        const randomCard = notGuessedCards[getRandom(notGuessedCards.length)];
        const tempOrder = card.style.order;
        card.style.order = randomCard.style.order;
        randomCard.style.order = tempOrder;
    });
}

function getRandom(n) {
    return Math.floor(Math.random() * n);
}

function getUniqueNumbers() {
    const set = new Set();

    while (set.size < cards.length) {
        set.add(getRandom(cards.length));
    }
    return [...set];
}

function resetGame(interval) {
    setTimeout(
        function() {
            clearInterval(interval);
            alert('You lose');
            window.location.reload();
        }, 0
    );
}

cards.forEach(function(card, i) {
    card.style.order = uniqueOrder[i];
    card.addEventListener('click', cardFlip);
});