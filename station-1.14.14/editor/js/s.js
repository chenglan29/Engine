if (localStorage.Engine == undefined) localStorage.Engine = JSON.stringify({});
SSave = (key, value) => {
    var res = JSON.parse(localStorage.Engine);
    res[key] = value;
    localStorage.Engine = JSON.stringify(res);
}
SRead = (key) => {
    var res = JSON.parse(localStorage.Engine);
    return res[key];
}