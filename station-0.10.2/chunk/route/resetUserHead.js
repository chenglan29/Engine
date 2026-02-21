app.post('/resetUserHead', (req, res) => {
    //此处需要验证是否存在该用户

    var user = db("user");
    if (user[req.headers.token.split("~")[0]].level == "root") {
        fs.writeFileSync(`./heads/${req.body.name}`, fs.readFileSync("./heads/backup"));
        res.status(200).json({
            success: true
        });
    }
    else if (user[req.headers.token.split("~")[0]].level == "admin" && user[req.body.name].level == "member") {
        fs.writeFileSync(`./heads/${req.body.name}`, fs.readFileSync("./heads/backup"));
        res.status(200).json({
            success: true
        });
    }
});