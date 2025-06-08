const fs = require("fs");
const fsp = require ("fs").promises;
const path = require('path');
const moment = require('moment');

const writeLogMessage = async(msg) => {
    return new Promise((resolve, reject) => {
        const fileName = `logs-${moment().format('YYYY-MM-DD')}.log`;
        const filePath = path.join(__dirname,'..','logs',"activity-logs",fileName);
        msg = `[${moment().format("YYYY-MM-DD")}] - ${msg}`;
        fs.appendFileSync(filePath,msg + `\n`);
        resolve();
    })
}

const handleException = async (e, callback = null) => {
    let fileName = `error-${moment().format('YYYY-MM-DD')}.log`;
    let filePath = path.join(__dirname,'..','logs',"error-logs",fileName);
    const regex = /\((.*):(\d+):(\d+)\)$/
    const errorSplit = e.stack.split("\n");
    let lines = [];
    for(let i = 0; i< errorSplit.length; i++) {
        const match = regex.exec(e.stack.split("\n")[i]);
        if(match) {
            lines.push({ filepath: match[1].split('\\').slice(-2).join('\\'), line: match[2], column: match[3] })
        }
    }
    const errorObj = { date: moment().format('YYYY-MM-DD H:mm:ss'), message: e.message, code: e.code, location: lines };
    console.log('==========ERROR=======', errorObj) // console for testing
    fs.appendFile(filePath, JSON.stringify(errorObj) + `\n`, function (err) {
        if (err) {
            return err;
        }
    });
    return;
    
}

const sleep = (time = 1) => {
    time = time * 1000;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('sleep done for ',time);
            resolve();
        }, time);
    })
}

module.exports = {
    writeLogMessage,
    handleException,
    sleep
}