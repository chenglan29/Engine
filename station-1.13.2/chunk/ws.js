const server = new WebSocket.Server(
    { port: db("config").wsPort },
    () => {
        logger.info(`交流服务器在 ${db("config").wsPort} 端口启用`)
    }
);
server.on("connection", socket => {
    socket.on("message", message => {
        var msg = JSON.parse(message)
        logger.debug("from WebSocket:", msg);
        if (socket.token == undefined) {
            var user = db("user");
            if (!user[msg.token.split("~")[0]]) socket.send(JSON.stringify({ type: "alert", message: '用户名不存在' }));
            else if (user[msg.token.split("~")[0]].token != msg.token.split("~")[1])
                socket.send(JSON.stringify({ type: "alert", message: '临时码不正确' }));
            else {
                socket.token = msg.token;
                socket.project = msg.project;
                socket.send(JSON.stringify({ type: "console.warn", message: '连接交流服务器成功' }));
            }
        }
        else {
            if (msg.modify != undefined) {

                var project = db("project")

                var obj = project[socket.project].path;
                msg.modify.name.split(".").forEach((item, index) => {
                    if (index != msg.modify.name.split(".").length - 1) obj = obj[item].path;
                    else obj = obj[item];
                });
                obj[msg.modify.key] = msg.modify.value;
                fs.writeFileSync("./db/project.json", JSON.stringify(project));
            }
            if (msg.createObject != undefined) {

                var project = db("project")

                var obj = project[socket.project].path;
                msg.createObject.name.split(".").forEach((item, index) => {
                    if (index != msg.createObject.name.split(".").length - 1) obj = obj[item].path;
                    else obj = obj[item];
                });
                if (obj.path == undefined) obj.path = [];
                obj.path.push({
                    "类型": msg.createObject.type
                })
                fs.writeFileSync("./db/project.json", JSON.stringify(project));
            }
            if (msg.deleteObject != undefined) {

                var project = db("project")

                var t = `project["${socket.project}"]`;
                    msg.deleteObject.split(".").forEach(item => {
                        t += `.path["${item}"]`
                    })
                    eval("delete " + t)
                fs.writeFileSync("./db/project.json", JSON.stringify(project));
            }
            server.clients.forEach(client => {
                if (client != socket) {
                    if (msg.talk != undefined) {
                        if (msg.talk.indexOf("->") != -1) {
                            if (client.token.split("~")[0] == msg.talk.split("->")[1]) {
                                client.send(JSON.stringify({ type: "console.log", message: `${socket.token.split("~")[0]} 私聊你: ${msg.talk.split("->")[0]}` }));
                            }
                            else if (msg.talk.split("->")[1] == "all") client.send(JSON.stringify({ type: "console.log", message: `${socket.token.split("~")[0]} 全屏公告: ${msg.talk.split("->")[0]}` }));
                        }
                        else if (socket.project == client.project) {
                            client.send(JSON.stringify({ type: "console.log", message: `${socket.token.split("~")[0]}: ${msg.talk}` }));
                        }
                    }
                    if ((msg.createObject != undefined || msg.modify != undefined || msg.deleteObject != undefined) && socket.project == client.project) {
                        client.send(JSON.stringify(msg));
                    }
                }
            });
        }
    })
})