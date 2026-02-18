const db = require("./db.js");

module.exports = (req, res,logger,func) => {
    try {
        const data = req.body; // 获取POST请求体数据
        logger.debug('接收到的数据:', data);
        if (data.username == "") res.status(401).json({ success: false, loginStatus: false, message: '用户名为空' });
        else if (data.password == "") res.status(401).json({ success: false, loginStatus: false, message: '密码为空' });
        else {
            var user = db("user");

            var isUserExits = false;
            Object.keys(user).forEach(item => {
                if (item == data.username) {
                    isUserExits = true;
                    if (user[item].password != data.password) {
                        res.status(401).json({ success: false, loginStatus: false, message: '密码错误' });
                    }
                    else {
                        func();
                    }
                }
            });
            if (isUserExits == false) res.status(401).json({ success: false, loginStatus: false, message: '用户不存在' });
        }
    }
    catch (e) {
        logger.error(e)
        res.json({ success: true, message: e });
    }
};