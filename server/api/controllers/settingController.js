const fs = require('fs');
const path = require('path')
const lockPath = path.resolve(path.dirname(require.main.filename), "lock");
let isOpen = true;

fs.readFile(lockPath, 'UTF-8', (err, data) => {
    if (err && err.code == "ENOENT") {
        fs.writeFileSync(lockPath, "false");
        startWatchingFile();
    } else if (err) throw err;
    else {
        isOpen = data == "true" ? false : true;
        startWatchingFile();
    }
});

exports.changeState = newState =>
    new Promise((resolve, reject) => {
        fs.writeFile(lockPath, newState == "lock" ? "true" : "false", err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });

exports.getState = () => isOpen;

function startWatchingFile() {
    fs.watch(lockPath, (curr, prev) => {
        fs.readFile(lockPath, "UTF-8", (err, data) => {
            isOpen = data == "true" ? false : true;
        });
    });
}