
const fs = require('fs');



let inter = null;
let counter = 1;

function start(){
    if(!process.env.LOG_PATH) return;

    fs.writeFileSync(process.env.LOG_PATH, (counter++) + '\n');
    clearInterval(inter);
    setInterval(() => {
        // console.log("Write to file");
        fs.appendFileSync(process.env.LOG_PATH, (counter++) + '\n');
    },500);
}


module.exports = {
    start, 
    stop(){
        clearInterval(inter);
    }
}