const drawBtn = document.querySelector('#drawBtn');
const cardList = document.querySelector('#cardList');
let deck_id;

let url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

drawBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let request;
    if (deck_id) {
        request = axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`);
    }
    else {
        request = axios.get(url);
    }
    request
        .then(function (data) {
            if (deck_id && data.data.remaining > 0) {
                addToCardList(data.data.cards[0])
            }
            else {
                deck_id = data.data.deck_id;
                console.log(data);
                axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`).then(data => addToCardList(data.data.cards[0]));
            }
        })
        .catch(err => console.log(err));
})

function addToCardList(card) {
    const el = document.createElement('li');
    el.innerText = `${card.value} of ${card.suit}`;
    cardList.appendChild(el);
}

window.addEventListener('load', function () {
    let request = axios.get(url);
    request
        .then(data => deck_id = data.data.deck_id)
        .catch(err => console.log(err));
})