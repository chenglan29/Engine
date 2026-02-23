const fs = require("fs");
module.exports = (name) => {
    return JSON.parse(fs.readFileSync(`db/${name}.json`).toString());
}