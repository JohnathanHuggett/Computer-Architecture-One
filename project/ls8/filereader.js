const FS = require("fs");

const argValue = process.argv.slice(2);

if (argValue.length != 1) {
    console.log(`usage: Node [fileLocation] [filename]`);
    process.exit(1);
}

const filename = argValue[0];
const fileData = FS.readFileSync(filename, "utf8");
const programLines = fileData.trim().split(/[\r\n]+/g);

const fileFormat = [];

for (let l of programLines) {
    if (!isNaN(l.substr(0, 8))) fileFormat.push(l.substr(0, 8));
}

module.exports = fileFormat;
