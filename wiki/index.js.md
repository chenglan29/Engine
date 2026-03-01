# 服务器入口文件代码文档

## 文件概述

文件对应服务器入口文件代码，核心功能是初始化服务器运行环境、加载依赖模块、启动服务器实例，并批量加载各类业务路由及工具脚本，为整个系统提供基础运行支撑。代码采用模块化加载方式，将不同功能的代码拆分至对应目录的文件中，提升代码可维护性和可读性。

## 核心功能说明

该文件是整个服务器应用的入口，主要完成以下4件核心工作：

- 初始化 Express 应用实例，启动 HTTP 服务器并监听指定端口；

- 加载 WebSocket 相关脚本、Express 中间件及所有业务处理路由；

## 代码解析
### HTTP 服务器初始化与启动
```js
var app = express(); // 初始化Express应用实例，用于处理HTTP请求、配置路由和中间件

var server = app.listen(db("config").port, () => {
    logger.info("服务器在", db("config").port, "端口开放");
}); // 启动HTTP服务器，监听配置文件中指定的端口，并输出启动日志
```

解析：

- db("config")：调用 db 工具函数，读取系统配置文件 ./db/config.json ，获取端口配置；

### 核心模块与路由加载
```js
eval(fs.readFileSync("./chunk/ws.js").toString()); // 加载WebSocket相关脚本，实现即时通讯功能
eval(fs.readFileSync("./chunk/middleware.js").toString()); // 加载 Express 中间件脚本，统一处理请求（如跨域、参数解析等）

// POST请求处理路由（批量加载所有业务路由）
eval(fs.readFileSync("./chunk/route/login.js").toString()); // 登录相关路由（处理用户登录请求）
eval(fs.readFileSync("./chunk/route/getProjectList.js").toString()); // 获取项目列表路由
eval(fs.readFileSync("./chunk/route/getUserList.js").toString()); // 获取用户列表路由
eval(fs.readFileSync("./chunk/route/submitProject.js").toString()); // 提交项目路由
eval(fs.readFileSync("./chunk/route/getInfo.js").toString()); // 获取基础信息路由
eval(fs.readFileSync("./chunk/route/updatePersonInfomation.js").toString()); // 更新个人信息路由
eval(fs.readFileSync("./chunk/route/getMemberInfomation.js").toString()); // 获取成员信息路由
eval(fs.readFileSync("./chunk/route/getProject.js").toString()); // 获取单个项目详情路由
eval(fs.readFileSync("./chunk/route/resetUserHead.js").toString()); // 重置用户头像路由
eval(fs.readFileSync("./chunk/route/setUserLevel.js").toString()); // 设置用户等级路由
eval(fs.readFileSync("./chunk/route/setUserPassword.js").toString()); // 修改用户密码路由
eval(fs.readFileSync("./chunk/route/setUserEmail.js").toString()); // 修改用户邮箱路由
eval(fs.readFileSync("./chunk/route/setUserPhone.js").toString()); // 修改用户手机号路由
eval(fs.readFileSync("./chunk/route/setUserToken.js").toString()); // 设置用户Token路由
eval(fs.readFileSync("./chunk/route/cancelUser.js").toString()); // 删除用户路由
eval(fs.readFileSync("./chunk/route/updatePersonHead.js").toString()); // 更新个人头像路由
eval(fs.readFileSync("./chunk/route/newUser.js").toString()); // 新增用户路由
eval(fs.readFileSync("./chunk/route/buildProject.js").toString()); // 创建项目路由
```
解析：

- ws.js：WebSocket 脚本，用于实现服务器与客户端的即时通讯（如实时消息推送、状态同步等）；

- middleware.js：Express 中间件脚本，包含请求体解析（express.json()）、身份验证前置校验等，对所有请求进行统一处理；

- 路由批量加载：所有业务相关的 POST 请求路由均放在 ./chunk/route/ 目录下，通过循环读取的方式批量加载，涵盖用户管理、项目管理两大核心模块，每个路由文件对应一个具体的业务接口，实现业务逻辑与入口文件的分离，便于后续维护和扩展。

### 编辑器相关脚本加载
```js
eval(fs.readFileSync("./editor/js/defined.js").toString()); // 加载解释器标签表和属性表
```

## 目录结构说明

代码中所有加载的脚本均按功能分类存放，目录结构如下：

- ./chunk/：核心模块目录，存放基础配置、日志、Express 中间件、WebSocket 及路由脚本；
  - ./chunk/route/：路由目录，存放所有业务接口的路由处理脚本；

- ./db/：配置与数据库目录，存放系统配置文件（config）及用户、项目等数据文件。

## 注意事项

- 模块化加载风险：代码中大量使用 eval() 函数执行外部脚本，虽然实现了模块化拆分，但存在安全风险（若外部脚本被篡改，可能导致恶意代码执行），生产环境建议替换为 require() 引入方式（需确保脚本符合 CommonJS 规范）。

- 脚本依赖顺序：加载顺序不可随意调整，需遵循“基础配置 → 日志 → 服务器初始化...”的顺序，否则会出现变量未定义、模块无法加载等错误（如 logger 需在服务器启动前加载，中间件需在路由前加载）。

- 配置依赖：服务器启动依赖 db("config").port 配置，需确保配置文件存在且端口参数有效，否则服务器无法正常启动。

- 可维护性：路由文件较多，建议后续可优化为“自动读取 ./chunk/route/ 目录下所有 js 文件”的动态加载方式，避免新增路由时需手动添加 eval() 语句。

## 核心模块关联说明

本入口文件加载的所有脚本相互关联，构成完整的服务器系统：

1. head.js + log4.js：提供基础环境和日志能力，为后续所有模块提供支撑；

2. express + server：创建服务器实例，监听端口，接收客户端请求；

3. middleware.js：对所有 HTTP 请求进行前置处理，保障请求合法性和一致性；

4. route 目录下的路由：处理具体的业务请求（如登录、项目操作、用户管理），是系统核心业务逻辑的入口；

5. ws.js：提供即时通讯能力，补充 HTTP 协议的局限性；

6. defined.js：解释器所用的标签表和属性表
