const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const log4js = require("log4js");
const db = require("./db.js");
const check = require("./check.js");
log4js.configure({
    appenders: {
        System: {
            type: "file",
            filename: `${db("config").logPath}${new Date().getTime()}.log`,
            maxLogSize: db("config").logMaxSize,
            backups: db("config").logBackups
        },
        Console: { type: "console" },
    },
    categories: { default: { appenders: ["System", "Console"], level: "debug" } },
});
const logger = log4js.getLogger("System");
var app = express();
// 中间件：UI
app.use('/editor', express.static('editor'));
// 中间件：解析JSON和URL编码格式的POST数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    if (req.path != '/login') {
        var user = db("user");
        if(req.headers.token == undefined)res.status(401).json({ success: false, message: '临时码缺失' });
        else if (!user[req.headers.token.split("~")[0]]) res.status(401).json({ success: false, message: '用户名不存在' });
        else if (user[req.headers.token.split("~")[0]].token != req.headers.token.split("~")[1])
            res.status(401).json({ success: false, message: '临时码不正确' });
        else next();
    }
    else next();
});
// POST请求处理路由
app.post('/login', (req, res) => {
    try {
        const data = req.body; // 获取POST请求体数据
        logger.debug('接收到的数据:', data);
        if (data.username == "") res.status(401).json({ success: false, message: '用户名为空' });
        else if (data.password == "") res.status(401).json({ success: false, message: '密码为空' });
        else {
            var user = db("user");
            var isUserExits = false;
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
app.get('/getProjectList', (req, res) => {
    res.status(200).json({
        success: true,
        projectList: db("project")
    });
});
app.get('/getUserList', (req, res) => {
    res.status(200).json({
        success: true,
        userList: Object.keys(db("user"))
    });
});
app.post('/submitProject', (req, res) => {
    res.status(200).json({ success: true });
    //没有记录代码
});
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
app.post('/getProject', (req, res) => {
    //此处需要验证是否拥有权限，以及是否存在该项目
    res.status(200).json({
        success: true,
        path: db("project")[req.body.project].path,
        log:db("project")[req.body.project].log
    });
});
var server = app.listen(db("config").port, () => {
    logger.info("服务器在", db("config").port, "端口开放");
});