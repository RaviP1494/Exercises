const inputDiv = document.querySelector('#inputDiv');
const queueDisplay = document.querySelector('#queueDisplay');
const factList = document.querySelector('#factList');

const numInput = document.querySelector('#numInput');

const queue = [];

function addToFactList(item) {
    const el = document.createElement("li");
    el.innerText = item;
    factList.appendChild(el);
}

async function requestOneFact(num){
    const request = await axios.get(`http://numbersapi.com/${num}?json`);
    addToFactList(request.data.text);
}

async function requestFourFacts(num){
    addToFactList('-------------');
    for(let i=0;i<4;i++){
        await requestOneFact(num);
    }
    addToFactList('-------------');
}

async function requestAllQFacts(q){
    addToFactList('-------------');
    for(const i of q){
        await requestOneFact(i);
    }
    addToFactList('-------------');
    q.length = 0;
    queueDisplay.innerText = 'Queue: ';
}

inputDiv.addEventListener('click', function(e){
    e.preventDefault();

    elementClicked = e.target.id;

    if(elementClicked === 'addQBtn'){
        queue.push(numInput.value);
        queueDisplay.innerText+= numInput.value + '|';
        numInput.value = null;
    }
    if(elementClicked === 'queueSubmitBtn'){
        requestAllQFacts(queue);
    }
    if(elementClicked === 'clearQBtn'){
        queue.length = 0;
        queueDisplay.innerText = 'Queue: ';
    }
    if(elementClicked === 'oneSubmitBtn'){
        requestOneFact(numInput.value);
    }
    if(elementClicked === 'fourSubmitBtn'){
        requestFourFacts(numInput.value);
    }
})

window.addEventListener('load', function(e){
    queueDisplay.innerText = 'Queue: ';
})