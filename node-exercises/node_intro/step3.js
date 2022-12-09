const axios = require('axios');
const fs = require('fs');

const argv = process.argv;

let outPath;
let readPath;

if (argv[2] === '--out') {
    outPath = argv[3];
    readPath = argv[4];
    if (argv[4].slice(0, 4) === 'http') {
        webCat(readPath, oPath = outPath);
    }
    else {
        cat(readPath, oPath = outPath);
    }
}
else {
    readPath = argv[2];
    if (readPath.slice(0, 4) === 'http') {
        webCat(readPath);
    }
    else {
        cat(readPath);
    }
}

async function cat(path, oPath = null) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            console.log(err.message);
            process.exit(1);
        }
        if (oPath) {
            fs.writeFile(oPath, data, 'utf8', function (err) {
                if (err) {
                    console.log(err.message);
                }
                console.log("File generated");
            });
        }
        else {
            console.log(data);
        }
    });
}

async function webCat(url, oPath = null) {
    axios.get(url)
        .then(data => {
            if (oPath) {
                fs.writeFile(oPath, data.data, 'utf8', function (err) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log("File generated");
                });
            }
            else{
                console.log(data.data);
            }
        })
        .catch(err => {
            console.log(`Error fetching ${url} \nError: ${err.message}`);
        });
}