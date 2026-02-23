app.post('/newUser', (req, res) => {
    //此处需要验证是否存在该用户
    var user = db("user");
    if (user[req.body.username] != undefined) {
        res.status(200).json({
            success: false,
            message: "用户名已存在"
        });
    }
    else {
        if (req.body.username == "") {
            res.status(200).json({
                success: false,
                messsage: "用户名不能为空"
            });
        }
        else {
            if (req.body.token == "") req.body.token = require("./token.js")(db("config").tokenLength);
            if (req.body.password == "") req.body.password = require("./token.js")(16);
            user[req.body.username] = {
                email: req.body.email,
                phone: req.body.phone,
                token: req.body.token,
                password: req.body.password,
                level: "member"
            };
            fs.writeFileSync(`./heads/${req.body.name}`, fs.readFileSync("./heads/backup"));
            fs.writeFileSync("./db/user.json", JSON.stringify(user));
            res.status(200).json({
                success: true
            });
        }
    }
});