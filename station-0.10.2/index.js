const fs = require("fs");
eval(fs.readFileSync("./chunk/head.js").toString());
eval(fs.readFileSync("./chunk/log4.js").toString());

var app = express();
var server = app.listen(db("config").port, () => {
    logger.info("服务器在", db("config").port, "端口开放");
});

eval(fs.readFileSync("./chunk/middleware.js").toString());

// POST请求处理路由
eval(fs.readFileSync("./chunk/route/login.js").toString());
eval(fs.readFileSync("./chunk/route/getProjectList.js").toString());
eval(fs.readFileSync("./chunk/route/getUserList.js").toString());
eval(fs.readFileSync("./chunk/route/submitProject.js").toString());
eval(fs.readFileSync("./chunk/route/getInfo.js").toString());
eval(fs.readFileSync("./chunk/route/updatePersonInfomation.js").toString());
eval(fs.readFileSync("./chunk/route/getMemberInfomation.js").toString());
eval(fs.readFileSync("./chunk/route/getProject.js").toString());
eval(fs.readFileSync("./chunk/route/resetUserHead.js").toString());
eval(fs.readFileSync("./chunk/route/setUserLevel.js").toString());
eval(fs.readFileSync("./chunk/route/setUserPassword.js").toString());
eval(fs.readFileSync("./chunk/route/setUserEmail.js").toString());
eval(fs.readFileSync("./chunk/route/setUserPhone.js").toString());
eval(fs.readFileSync("./chunk/route/setUserToken.js").toString());
eval(fs.readFileSync("./chunk/route/cancelUser.js").toString());
eval(fs.readFileSync("./chunk/route/updatePersonHead.js").toString());
eval(fs.readFileSync("./chunk/route/newUser.js").toString());