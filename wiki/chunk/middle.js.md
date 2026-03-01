# 服务器中间件配置文档

文件对应服务器核心中间件配置代码，基于Express框架编写，包含静态资源托管、请求数据解析、Token身份验证三大核心功能，是服务器处理客户端请求的前置基础，直接影响接口请求的合法性、数据解析的正确性及静态资源的可访问性，与服务器入口文件、路由接口密切关联。

## 中间件完整代码

```javascript
// 中间件：UI 静态资源托管
app.use('/editor', express.static('editor'));
app.use('/heads', express.static('heads'));
app.use('/debug', express.static('debug'));

// 中间件：解析JSON和URL编码格式的POST数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 中间件：验证令牌（Token）
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
```

## 中间件分类及详细解析

### 静态资源托管

核心功能：将指定目录的静态资源（如HTML、CSS、JS、图片等）托管到对应路由，供客户端通过URL直接访问，无需额外编写路由接口，主要用于UI相关资源的访问。

|代码行|核心用途|路径说明|访问示例|
|---|---|---|---|
|app.use('/editor', express.static('editor'));|托管编辑器UI|路由路径：/editor；对应本地目录：./editor|访问editor目录下的index.html：http://服务器IP:端口/editor/index.html|
|app.use('/heads', express.static('heads'));|托管用户头像，主要用于存储和访问用户头像文件|路由路径：/heads；对应本地目录：./heads|访问heads目录下的头像文件：http://服务器IP:端口/heads/xxx.jpg|
|app.use('/debug', express.static('debug'));|托管调试页面|路由路径：/debug；对应本地目录：./debug|访问调试页面：http://服务器IP:端口/debug/项目下标/时间戳/index.html|
## 请求数据解析

核心功能：解析客户端发送的POST请求数据，将JSON格式、URL编码格式的请求体数据转换为JavaScript对象，供后续路由接口直接使用（如req.body获取请求数据），是接口接收客户端参数的基础。

|代码行|解析类型|核心说明|使用场景|
|---|---|---|---|
|app.use(bodyParser.json());|JSON格式请求体|解析客户端发送的Content-Type为application/json的请求数据，将其转为req.body对象|前端通过JSON字符串格式发送POST请求（如用户登录、数据提交）|
|app.use(bodyParser.urlencoded({ extended: true }));|URL编码格式请求体|解析客户端发送的Content-Type为application/x-www-form-urlencoded的请求数据；extended: true表示支持复杂的嵌套对象解析|文件上传|

## Token身份验证

核心功能：作为全局中间件，对除登录接口（/login）外的所有请求进行Token校验，验证请求的合法性，防止未授权访问，是系统权限管控的核心前置校验逻辑，与用户配置文件、db读取函数、日志工具密切关联。

### 代码逐行解析

```javascript
// 全局中间件，接收req（请求对象）、res（响应对象）、next（继续执行后续中间件/路由的方法）
app.use((req, res, next) => {
    // 若请求体存在，通过日志工具（logger）输出请求URL和请求体，用于调试
    if (req.body != undefined) logger.debug(req.url, req.body);
    // 登录接口（/login）跳过Token校验，直接执行后续逻辑（允许未登录用户发起登录请求）
    if (req.path != '/login') {
        var user = db("user"); // 调用db读取函数，读取用户数据库（./db/user.json）
        // 校验1：请求头中未携带token，返回401未授权，提示“临时码缺失”
        if (req.headers.token == undefined) res.status(401).json({ success: false, message: '临时码缺失' });
        // 校验2：token拆分后的用户名，在用户数据库中不存在，返回401，提示“用户名不存在”
        else if (!user[req.headers.token.split("~")[0]]) res.status(401).json({ success: false, message: '用户名不存在' });
        // 校验3：token拆分后的令牌部分，与用户数据库中存储的token不一致，返回401，提示“临时码不正确”
        else if (user[req.headers.token.split("~")[0]].token != req.headers.token.split("~")[1])
            res.status(401).json({ success: false, message: '临时码不正确' });
        // 所有校验通过，执行next()，继续处理后续路由接口
        else next();
    }
    // 登录接口直接执行next()，跳过校验
    else next();
});
```

### Token校验规则

- Token格式要求：请求头中携带的token需为“用户名~令牌”格式（通过split("~")拆分）

- 校验流程（非/login接口）：请求头token存在 -> 拆分出的用户名在用户数据库中存在 -> 拆分出的令牌与数据库中存储的token一致 -> 校验通过。

- 免校验接口：仅/login接口跳过校验，允许未登录用户发起登录请求，获取合法Token后，再访问其他接口。

- 错误响应：所有校验失败场景，均返回401未授权状态码，及对应的错误提示，便于前端排查问题。

## 中间件关联说明

本中间件配置与服务器其他核心模块紧密关联，确保系统正常运行，核心关联逻辑如下：

- 与静态资源目录：静态资源托管中间件关联editor、heads、debug三个目录，需确保这些目录存在于项目根目录，否则客户端无法访问对应资源（如用户头像、编辑器UI）。

- 与业务路由：请求数据解析中间件为所有POST路由接口（如login.js、cancelUser.js）提供请求体解析支持，确保接口能通过req.body获取客户端参数；Token校验中间件为除/login外的所有路由提供身份校验，保障接口安全。

- 与用户配置文件：Token校验中间件通过db("user")读取用户数据库，比对请求头token与数据库中存储的token，确保身份验证的有效性。

- 与日志工具：Token校验中间件中通过logger.debug()输出请求信息，依赖log4.js配置的日志工具，便于调试和排查请求异常。

## 使用注意事项

- 静态资源目录：确保editor、heads、debug目录存在于项目根目录，且目录内有对应静态资源；若目录路径修改，需同步修改中间件中的路径参数。

- Token格式：客户端请求（除/login外）需在请求头中携带正确格式的token（用户名~令牌），否则会被拦截，返回401未授权响应。

- 调试日志：logger.debug()仅用于调试，生产环境可根据需求关闭，避免日志冗余；需确保log4.js已正确配置，否则日志无法正常输出。

- 异常处理：当前Token校验中间件已覆盖核心异常场景（token缺失、用户名不存在、token错误），但未处理db读取失败、token格式错误（无法split拆分）等异常，建议补充try-catch逻辑，提升健壮性。

## 常见问题排查

- 静态资源无法访问：检查中间件配置的目录路径是否正确、目录是否存在、服务器是否有该目录的读取权限；访问URL是否与中间件配置的路由路径一致。

- 接口返回401“临时码缺失”：检查客户端请求头是否携带token，是否正确设置请求头key为“token”。

- 接口返回401“用户名不存在”：检查token中拆分的用户名（split("~")[0]）是否存在于用户数据库（./db/user.json）中。

- 接口返回401“临时码不正确”：检查token中拆分的令牌部分（split("~")[1]）是否与用户数据库中存储的token一致，若token已更新，需客户端使用新token请求。