app.post('/updatePersonInfomation', (req, res) => {
    var user = db("user");
    user[req.headers.token.split("~")[0]].email = req.body.email;
    user[req.headers.token.split("~")[0]].phone = req.body.phone;
    if (req.body.new_password == "") {
        res.status(200).json({
            success: true
        });
    }
    else if (req.body.password != user[req.headers.token.split("~")[0]].password) {
        res.status(200).json({
            success: false,
            message: "其他资料更新完毕\n但您的原密码错误，所以更改失败"
        });
    }
    else {
        user[req.headers.token.split("~")[0]].password = req.body.new_password;
        res.status(200).json({
            success: true
        });
    }
    fs.writeFileSync("./db/user.json", JSON.stringify(user));
});