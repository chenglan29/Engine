app.get('/getInfo', (req, res) => {
    var data = db("user")[req.headers.token.split("~")[0]];
    data.password = "";
    data.token = "";
    //屏蔽敏感信息
    res.status(200).json({
        success: true,
        infomation: data
    });
});