const fs = require('axios');

const argv = process.argv;

if(argv[2]){
    try{
        cat(String(argv[2]));
    }
    catch(err){
        console.log(err.message);
    }
}

function cat(path) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            console.log(err.message);
            process.exit(1);
        }
        console.log(data);
    });
}

function webCat(url){

}