app.post('/setUserToken', (req, res) => {
    //此处需要验证是否存在该用户
    var user = db("user");
    if (user[req.headers.token.split("~")[0]].level == "root") {
        user[req.body.name].token = req.body.token;
        fs.writeFileSync("./db/user.json",JSON.stringify(user));
        res.status(200).json({
            success: true
        });
    }
    else if (user[req.headers.token.split("~")[0]].level == "admin" && user[req.body.name].level == "member") {
        user[req.body.name].token = req.body.token;
        fs.writeFileSync("./db/user.json",JSON.stringify(user));
        res.status(200).json({
            success: true
        });
    }
});