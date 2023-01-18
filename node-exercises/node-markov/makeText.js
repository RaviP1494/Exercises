/** Command-line tool to generate Markov text. */

const axios = require('axios');
const fs = require('fs');
const { MarkovMachine } = require('./markov');

const argv = process.argv;

if(argv[2] === 'file'){
    const p = argv[3];
    fs.readFile(p, 'utf8', function (err, data) {
        if (err) {
            console.log(err.message);
            process.exit(1);
        }
        respond(data);
    });
}
else if(argv[2] === 'url'){
    const u = argv[3];
    axios.get(u)
        .then(data => respond(data.data))
        .catch(err => {
            console.log(`Error fetching ${u}`);
            console.log(`Error: ${err.message}`)
            process.exit(1);
        });
}

else{
    console.log('Incorrect input type');
}

function respond(text){
    const mm = new MarkovMachine(text);
    console.log(mm.makeText());
}