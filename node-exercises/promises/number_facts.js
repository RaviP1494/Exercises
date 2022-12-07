const fact_list = document.querySelector("#fact-list");
const findBtn = document.querySelector("#findBtn");
const queueBtn = document.querySelector("#queueBtn");
const numInput = document.querySelector("#numInput");
const queueDisplay = document.querySelector("#queueDisplay");
const findFourBtn = document.querySelector("#findFourBtn");
const queue = [];

findBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let batchStr = '';
    for (let i = 0; i < queue.length; i++) {
        batchStr += queue[i];
        if (i != queue.length - 1) {
            batchStr += ',';
        }
    }
    if (numInput.value != 0) {
        batchStr += ',' + numInput.value;
    }
    let request;
    if (queue.length > 0) {
        request = axios.get(`http://numbersapi.com/${batchStr}?json`);
    }
    else {
        request = axios.get(`http://numbersapi.com/${numInput.value}?json`);
    }
    request
        .then(function (data) {
            if (queue.length > 0) {
                for (num in data.data) {
                    addToFactList(data.data[num]);
                }
                queue.length = 0;
                queueDisplay.innerText = 0;
            }
            else{
                addToFactList(data.data.text);
            }
        })
        .catch(err => addToFactList(err.message));
})

queueBtn.addEventListener('click', function (e) {
    e.preventDefault();
    queue.push(numInput.value);
    queueDisplay.innerText += numInput.value + '|';
    numInput.value = 0;
})

findFourBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let request = axios.get(`http://numbersapi.com/${numInput.value}?json`);
    request.then(data => addToFactList(data.data.text));
    request = axios.get(`http://numbersapi.com/${numInput.value}?json`);
    request.then(data => addToFactList(data.data.text));
    request = axios.get(`http://numbersapi.com/${numInput.value}?json`);
    request.then(data => addToFactList(data.data.text));
    request = axios.get(`http://numbersapi.com/${numInput.value}?json`);
    request.then(data => addToFactList(data.data.text));
})

function addToFactList(fact) {
    const el = document.createElement("li");
    el.innerText = fact;
    fact_list.appendChild(el);
}