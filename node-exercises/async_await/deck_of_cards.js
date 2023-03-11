const inputDiv = document.querySelector('#inputDiv');
const cardList = document.querySelector('#cardList');
const drawCount = document.querySelector('#drawCount');
const remainingDisplay = document.querySelector('#remainingDisplay');

const newDeckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
const newCardUrl = "https://deckofcardsapi.com/api/deck/";

let deck_id;

function addToCardList(card) {
    const el = document.createElement('li');
    el.innerText = `${card.value} of ${card.suit}`;
    cardList.appendChild(el);
}

async function drawCards() {
    const reqUrl = newCardUrl + `${deck_id}/draw/?count=${drawCount.value}`;
    const request = await axios.get(reqUrl);
    remainingDisplay.innerText = `Remaining: ${request.data.remaining}`;
    for (const i of request.data.cards) {
        addToCardList(i);
    }
    if (request.data.remaining === 0) {
        setTimeout(shuffleDeck, 2000);
    }
}

async function shuffleDeck() {
    cardList.textContent = '';
    const req = await axios.get(newDeckUrl);
    deck_id = req.data.deck_id;
    remainingDisplay.innerText = `Remaining: ${req.data.remaining}`;
}

inputDiv.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.id === 'drawBtn') {
        drawCards(deck_id);
    }
    else if (e.target.id === 'shuffleBtn') {
        shuffleDeck();
    }
});

window.addEventListener('load', function (e) {
    shuffleDeck();
    drawCount.value = 1;
});