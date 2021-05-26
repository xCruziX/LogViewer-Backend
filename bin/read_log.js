const readLastLines = require('read-last-lines');
const fs = require('fs');

let interRead = null;
let timeStopRead = null;
let lisLines = [];
let sizeFile = 0;
let bFirstRead = true;

async function getLog(){
    await startReadInter();
    return lisLines;
}

function startTimeout(){
    clearTimeout(timeStopRead);
    timeStopRead = setTimeout(stopReadInter,50*1000);
}


function mergeLines(linesArr){
    // Merge das neue Array in das vorhandene und entferne doppelte Einträge
    let bigArray = [];
    // Wenn das vorhandene Array zu groß ist hole die letzten 150 zeichen und merge diese
    if(lisLines.length > 200)
        bigArray = lisLines.splice(lisLines.length-151);
    else
        bigArray = lisLines;
    const merged = [...new Set([...bigArray, ...linesArr])];
    lisLines = [...lisLines,...merged].reverse();
}

async function readLog(){
    const file = process.env.LOG_PATH;
    if(!file) return console.log('LOG_PATH is empty');
    if (!fs.existsSync(file)) return console.log(`File ${file} doesn't exists`);

    try {
        let lines = null;
        const stats = fs.statSync(file);
        if(bFirstRead || stats.size < sizeFile) { // Beim ersten Aufruf, oder wenn das Logfile gelehrt wurde das ganze file lesen
            console.log('Read whole file');
            lines = fs.readFileSync(file, 'utf8');
            bFirstRead = false;
        }
        else {
            console.log('Read last 100 Lines');
            lines =  await readLastLines.read(file, 100);
        }
        lines = lines.trim();
        sizeFile = stats.size;
        let splitPattern = '\n';
        if(lines.includes('\n\r'))
            splitPattern += '\r';
        const linesArr = lines.split(splitPattern); // Schneide beim Zeilenumbruch
        // console.log(new Date() + ' Lines: \n' + linesArr);
        // lisLines = linesArr;
        mergeLines(linesArr);
      } catch(err) {
        console.error(err)
      }
}

async function startReadInter(){
    
    await readLog();
    const seconds = (process.env.INTERVALL_SECONDS ?? 5)*1000;
    if(interRead) clearInterval(interRead);
    interRead = setInterval(async () => await readLog(),seconds);
    startTimeout();
}

function stopReadInter(){
    console.log('Stop Readinterval');
    clearInterval(interRead);
    bFirstRead = true;
}

module.exports = {
    getLog,
    stopReadInter
}