const axios = require('axios');
const fs = require('fs');

const argv = process.argv;

if (argv[2].slice(0,4) == 'http') {
    webCat(argv[2]);
}
else{
    cat(argv[2]);
}

function cat(path) {
    const p = makeString(path);
    fs.readFile(p, 'utf8', function (err, data) {
        if (err) {
            console.log(err.message);
            process.exit(1);
        }
        console.log(data);
    });
}

function webCat(url) {
    const u = makeString(url);
    axios.get(u)
        .then(data => console.log(data.data))
        .catch(err => {
            console.log(`Error fetching ${url}`);
            console.log(`Error: ${err.message}`)
        });
}

function makeString(str){
    let s;
    try{
        s = String(str);
    }
    catch (err){
        console.log(err.message);
    }
    return s;
}