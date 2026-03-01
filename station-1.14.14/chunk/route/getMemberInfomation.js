app.get('/getMemberInfomation', (req, res) => {
    var user = db("user");
    if (user[req.headers.token.split("~")[0]].level == "root") {
        res.status(200).json({
            success: true,
            list: user
        });
    }
    else if (user[req.headers.token.split("~")[0]].level == "admin") {
        var data = db("user");
        //屏蔽root权限的password和token
        Object.keys(data).forEach(item => {
            if (data[item].level == "root") {
                data[item].password = "";
                data[item].token = "";
            }
        })
        res.status(200).json({
            success: true,
            list: data
        });
    }
    else {
        var data = db("user");
        //屏蔽所有人的password和token
        Object.keys(data).forEach(item => {
            data[item].password = "";
            data[item].token = "";
        })
        res.status(200).json({
            success: true,
            list: data
        });
    }
});