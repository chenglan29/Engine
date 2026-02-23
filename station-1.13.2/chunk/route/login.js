app.post('/login', (req, res) => {
    try {
        const data = req.body; // 获取POST请求体数据
        if (data.username == "") res.status(401).json({ success: false, message: '用户名为空' });
        else if (data.password == "") res.status(401).json({ success: false, message: '密码为空' });
        else {
            var isUserExits = false;

            var user = db("user");
            Object.keys(user).forEach(item => {
                if (item == data.username) {
                    isUserExits = true;
                    if (user[item].password != data.password) {
                        res.status(401).json({ success: false, message: '密码错误' });
                    }
                    else {
                        user[item].token = require("./token.js")(db("config").tokenLength);
                        fs.writeFileSync("./db/user.json", JSON.stringify(user));
                        res.status(200).json({
                            success: true,
                            token: item + "~" + user[item].token
                        });
                    }
                }
            });
            if (isUserExits == false) res.status(401).json({ success: false, message: '用户不存在' });
        }
    }
    catch (e) {
        logger.error(e)
        res.json({ success: true, message: e });
    }
});