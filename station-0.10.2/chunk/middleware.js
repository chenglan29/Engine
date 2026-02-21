// 中间件：UI
app.use('/editor', express.static('editor'));
app.use('/heads', express.static('heads'));
// 中间件：解析JSON和URL编码格式的POST数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 中间件：验证令牌
app.use((req, res, next) => {
    if (req.body != undefined) logger.debug(req.url, req.body);
    if (req.path != '/login') {
        var user = db("user");
        if (req.headers.token == undefined) res.status(401).json({ success: false, message: '临时码缺失' });
        else if (!user[req.headers.token.split("~")[0]]) res.status(401).json({ success: false, message: '用户名不存在' });
        else if (user[req.headers.token.split("~")[0]].token != req.headers.token.split("~")[1])
            res.status(401).json({ success: false, message: '临时码不正确' });
        else next();
    }
    else next();
});