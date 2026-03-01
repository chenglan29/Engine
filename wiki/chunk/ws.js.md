# WebSocket交流服务器

文件对应服务器WebSocket交流服务器核心配置代码，基于Node.js原生WebSocket模块编写，与Express HTTP服务器协同工作，核心功能包括建立客户端与服务器的即时通讯连接、Token身份验证、项目协作操作同步、私聊/公告推送等，是项目协作中实时交互的核心组件，与服务器配置文件、用户数据库、项目数据库及日志工具密切关联。

## 核心功能概述

本WebSocket交流服务器基于Node.js`WebSocket.Server`构建，运行在配置文件指定的`wsPort`端口，核心实现两大类功能，支撑项目协作中的实时交互需求：

- 连接验证：客户端首次连接时，通过Token进行身份校验，确保只有合法用户能接入交流服务器；

- 实时交互：已验证连接的客户端可执行项目操作（创建、修改、删除项目对象）和消息推送（私聊、群聊、全屏公告），且操作结果和消息会同步给相关客户端，实现实时协作。

## 代码逐模块详细解析

### WebSocket服务器初始化

```javascript
const server = new WebSocket.Server(
    { port: db("config").wsPort },
    () => {
        logger.info(`交流服务器在 ${db("config").wsPort} 端口启用`)
    }
);
```

核心解析：

- 创建服务器实例：通过`new WebSocket.Server()`创建WebSocket服务器实例，配置参数为端口号，端口号读取自服务器配置文件（`db("config").wsPort`），与之前配置文档中的`wsPort`参数保持一致；

- 启动回调：服务器成功启动后，通过日志工具（`logger.info()`）输出启动信息，包含启用的端口号，便于运维排查和调试；

### 消息解析与首次连接验证

```javascript
var msg = JSON.parse(message)
logger.debug("from WebSocket:", msg);
if (socket.token == undefined) {
    // 首次连接：Token身份验证
    var user = db("user");
    if (!user[msg.token.split("~")[0]]) socket.send(JSON.stringify({ type: "alert", message: '用户名不存在' }));
    else if (user[msg.token.split("~")[0]].token != msg.token.split("~")[1])
        socket.send(JSON.stringify({ type: "alert", message: '临时码不正确' }));
    else {
        // 验证通过：绑定Token和项目信息，更新项目参与人
        socket.token = msg.token;
        socket.project = msg.project;
        var list = db("project");
        if(list[socket.project].contributor.indexOf(msg.token.split("~")[0]) == -1){
            list[socket.project].contributor.push(msg.token.split("~")[0]);
            fs.writeFileSync("./db/project.json",JSON.stringify(list));
        }
        socket.send(JSON.stringify({ type: "console.warn", message: '连接交流服务器成功' }));
    }
}
```

#### 消息解析

`var msg = JSON.parse(message)`：客户端发送的消息为JSON字符串格式，需解析为JavaScript对象后才能处理；同时通过`logger.debug()`输出消息内容，用于调试。

#### 首次连接Token校验（socket.token未绑定）

客户端首次连接时，`socket.token`为`undefined`，需通过客户端发送的`msg.token`进行身份校验：

- 校验1：拆分`msg.token`（格式为“用户名~令牌”），判断拆分后的用户名是否存在于用户数据库（`db("user")`），不存在则返回“用户名不存在”提示；
- 校验2：判断拆分后的令牌与用户数据库中存储的`token`是否一致，不一致则返回“临时码不正确”提示；
- 校验通过：
    - 为当前`socket`绑定`token`（标识客户端身份）和`project`（标识客户端所属项目）；
    - 更新项目参与人：若当前用户未在所属项目的`contributor`数组中，将其添加进去，并通过`fs.writeFileSync()`写入项目数据库（`./db/project.json`）；
    - 向客户端发送“连接交流服务器成功”提示，告知客户端已成功接入。

### 已验证连接的业务处理

当客户端已完成身份验证（`socket.token`已绑定），服务器将处理客户端发送的各类业务请求，包括项目对象操作和消息推送，核心分为两大模块。

#### 项目对象操作（创建、修改、删除）

客户端可发送`modify`、`createObject`、`deleteObject`三种类型的请求，用于操作项目数据库中的对象，操作后同步写入数据库并推送至相关客户端：

##### 修改项目对象（msg.modify）

```javascript
if (msg.modify != undefined) {
    var project = db("project")
    var obj = project[socket.project].path;
    // 根据msg.modify.name的层级路径，定位到要修改的对象
    msg.modify.name.split(".").forEach((item, index) => {
        if (index != msg.modify.name.split(".").length - 1) obj = obj[item].path;
        else obj = obj[item];
    });
    // 修改目标对象的指定属性值
    obj[msg.modify.key] = msg.modify.value;
    // 写入项目数据库，持久化修改
    fs.writeFileSync("./db/project.json", JSON.stringify(project));
}
```

逻辑说明：根据`msg.modify.name`的层级路径（如“主程序.子元素”），定位到项目中要修改的对象，修改指定属性（`msg.modify.key`）的值（`msg.modify.value`），并将修改后的项目数据写入数据库。

##### 创建项目对象（msg.createObject）

```javascript
if (msg.createObject != undefined) {
    var project = db("project")
    var obj = project[socket.project].path;
    // 根据msg.createObject.name的层级路径，定位到父对象
    msg.createObject.name.split(".").forEach((item, index) => {
        if (index != msg.createObject.name.split(".").length - 1) obj = obj[item].path;
        else obj = obj[item];
    });
    // 若父对象无path属性，初始化path数组
    if (obj.path == undefined) obj.path = [];
    // 向父对象的path数组中添加新对象
    obj.path.push({
        "类型": msg.createObject.type
    })
    // 写入项目数据库，持久化创建操作
    fs.writeFileSync("./db/project.json", JSON.stringify(project));
}
```

逻辑说明：根据`msg.createObject.name`的层级路径，定位到要创建新对象的父对象，若父对象无`path`属性则初始化，然后向父对象的`path`数组中添加新对象（仅包含“类型”属性），最后写入数据库。

##### 删除项目对象（msg.deleteObject）

```javascript
if (msg.deleteObject != undefined) {
    var project = db("project")
    // 拼接要删除对象的层级路径字符串
    var t = `project["${socket.project}"]`;
        msg.deleteObject.split(".").forEach(item => {
            t += `.path["${item}"]`
        })
    // 通过eval()执行删除操作
    eval("delete " + t)
    // 写入项目数据库，持久化删除操作
    fs.writeFileSync("./db/project.json", JSON.stringify(project));
}
```

逻辑说明：根据`msg.deleteObject`的层级路径（如“主程序.子模块”），拼接出删除对象的路径字符串，通过`eval()`执行删除操作，最后写入数据库完成持久化。

### 消息推送与操作同步

```javascript
server.clients.forEach(client => {
    if (client != socket) {
        // 处理聊天消息（私聊、全屏公告、项目内群聊）
        if (msg.talk != undefined) {
            if (msg.talk.indexOf("->") != -1) {
                // 私聊：格式为“消息内容->用户名”
                if (client.token.split("~")[0] == msg.talk.split("->")[1]) {
                    client.send(JSON.stringify({ type: "console.log", message: `${socket.token.split("~")[0]} 私聊你: ${msg.talk.split("->")[0]}` }));
                }
                // 全屏公告：格式为“公告内容->all”
                else if (msg.talk.split("->")[1] == "all") client.send(JSON.stringify({ type: "console.log", message: `${socket.token.split("~")[0]} 全屏公告: ${msg.talk.split("->")[0]}` }));
            }
            // 项目内群聊：同一项目下的所有成员可见
            else if (socket.project == client.project) {
                client.send(JSON.stringify({ type: "console.log", message: `${socket.token.split("~")[0]}: ${msg.talk}` }));
            }
        }
        // 同步项目操作（创建、修改、删除对象）：同一项目下的所有成员同步更新
        if ((msg.createObject != undefined || msg.modify != undefined || msg.deleteObject != undefined) && socket.project == client.project) {
            client.send(JSON.stringify(msg));
        }
    }
});
```

核心解析：通过`server.clients`遍历所有已连接的客户端，排除当前发送请求的客户端（`client != socket`），实现消息和操作结果的同步推送：

- 聊天消息推送：
    - 私聊：消息格式为“消息内容->用户名”，仅推送给目标用户名对应的在线成员；
    - 全屏公告：消息格式为“公告内容->all”，推送给所有在线成员；
    - 项目内群聊：消息无特殊格式，仅推送给与当前客户端所属同一项目（`socket.project == client.project`）的客户端。
- 项目操作同步：当客户端执行创建、修改、删除项目对象的操作时，将操作消息推送给同一项目下的其他客户端，确保所有项目成员看到的项目数据实时一致。

## 核心关联说明

本WebSocket交流服务器与系统其他核心模块紧密关联，确保实时协作功能正常运行，核心关联逻辑如下：
- 与服务器配置文件：通过`db("config").wsPort`读取WebSocket服务器端口，与配置文件中的`wsPort`参数一致，确保端口配置统一；
- 与用户数据库：首次连接时，通过`db("user")`读取用户信息，进行Token身份校验；
- 与项目数据库：通过`db("project")`读取和修改项目数据，操作后通过`fs.writeFileSync()`写入`./db/project.json`；
- 与日志工具：通过`logger.info()`输出服务器启动信息，`logger.debug()`输出客户端发送的消息，依赖log4.js配置的日志工具，便于调试和排查异常；
- 与客户端：客户端需通过正确格式的Token连接服务器，发送的消息需为JSON格式，且遵循约定的消息字段（如`modify`、`talk`），才能被服务器正确处理。

## 使用注意事项

- 端口配置：确保配置文件中的`wsPort`端口未被占用，且与HTTP服务器端口（`port`）区分，避免端口冲突，否则WebSocket服务器无法正常启动；

- Token格式：客户端首次连接时，发送的`msg.token`需为“用户名~令牌”格式，与Token中间件、用户配置文件中的Token格式一致，否则验证失败；

- 消息格式：客户端发送的所有消息需为合法JSON格式，且包含约定的字段（如验证时的`token`、`project`，操作时的`modify`等），否则服务器无法解析；

- 安全风险：
    - 使用`eval()`执行删除操作，存在安全风险（若`msg.deleteObject`被篡改，可能执行恶意代码），生产环境建议替换为安全的路径定位方式；
    - 未对客户端发送的消息进行合法性校验（如`msg.modify.name`路径是否存在），可能导致`undefined`报错，建议补充校验逻辑；

- 数据库操作：`fs.writeFileSync()`为同步写入方法，若项目数据较大或操作频繁，可能阻塞服务器主线程，建议替换为异步写入方法（如`fs.writeFile()`）；

- 连接管理：未实现客户端断开连接（`close`事件）的处理逻辑，若客户端异常断开，服务器可能残留无效连接，建议补充断开连接的清理逻辑。

## 常见问题排查

- WebSocket服务器无法启动：检查`wsPort`端口是否被占用、配置文件是否存在语法错误、db读取函数是否能正常读取配置；

- 客户端连接失败：检查客户端发送的Token格式是否正确、用户名和令牌是否匹配、服务器`wsPort`端口是否正确（使用`get /getProject`时会告知客户端`wsPort`）；

- 消息无法推送：检查客户端是否已完成身份验证（`socket.token`是否绑定）、消息格式是否为合法JSON、发送的消息字段是否符合约定；

- 项目操作未同步：检查客户端所属项目（`socket.project`）是否正确、项目数据库路径（`./db/project.json`）是否正确、服务器是否有写入权限；
