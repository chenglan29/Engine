# /login 接口文档

## 接口基本信息

|项目|详细说明|
|---|---|
|接口路径|/login|
|请求方法|POST|
|核心功能|接收用户登录请求，校验用户名、密码合法性，校验通过后生成用户token并更新至用户数据，返回token；校验失败返回对应错误信息，包含异常捕获机制|
|数据交互格式|请求、响应均为JSON格式|
## 请求参数说明

### 请求体（Body）

|参数名|必选|类型|说明|
|---|---|---|---|
|username|是|String|用户登录用户名，需与数据库（user集合）中存储的用户名（键名）完全一致，不可为空|
|password|是|String|用户登录密码，需与数据库中该用户的password字段完全匹配，不可为空|

## 代码逻辑解析

- **异常捕获**：整个接口逻辑包裹在try-catch块中，捕获接口执行过程中的所有异常，异常时通过logger模块记录错误信息，并返回包含异常信息的响应（注：异常响应success设为true为代码固有逻辑，建议优化）。
- **请求体数据获取**：通过req.body获取POST请求体中的登录数据（username、password），作为后续校验的基础。
- **基础校验（非空校验）**：
    - 若username为空，返回状态码401，提示“用户名为空”，登录失败。
    - 若password为空，返回状态码401，提示“密码为空”，登录失败。
- **用户存在性与密码校验**：
    - 读取user集合数据，通过Object.keys(user)遍历所有用户名，判断请求的username是否存在（用isUserExits标识）。
    - 若用户存在（isUserExits为true），校验请求的password与数据库中该用户的password是否一致：密码不一致则返回401，提示“密码错误”；密码一致则执行后续token生成操作。
    - 若遍历结束后isUserExits仍为false，说明请求的用户名不存在，返回401，提示“用户不存在”。

- **token生成与数据更新**：
    - 密码校验通过后，通过require("./token.js")引入token生成模块，结合config配置中的tokenLength（token长度），生成用户专属token。
    - 将生成的token更新至该用户的token字段，通过fs.writeFileSync同步写入./db/user.json文件，更新用户数据。
- **登录成功响应**：返回状态码200，success设为true，token格式为“用户名~生成的token”（用于后续接口的身份验证）。

## 响应说明

### 成功响应

```json
{
  "success": true,
  "token": "rootUser~abc123def456"  // 格式：用户名~生成的token字符串
}
```

状态码：200（OK），表示登录成功，返回的token用于后续接口请求的身份验证（如请求头携带token）。

### 错误响应（校验失败）

|状态码|响应内容|错误原因|
|---|---|---|
|401|{ "success": false, "message": "用户名为空" }|请求体中username字段为空|
|401|{ "success": false, "message": "密码为空" }|请求体中password字段为空|
|401|{ "success": false, "message": "用户不存在" }|请求的username在user集合中未找到|
|401|{ "success": false, "message": "密码错误" }|请求的password与数据库中该用户的password不匹配|
### 异常响应

```json
{
  "success": true,
  "message": "具体异常信息"  // 示例：db模块读取失败、token模块引入失败等
}
```

状态码：默认200（代码未指定异常状态码，建议优化为500），表示接口执行过程中出现异常，message字段为具体异常信息，同时会通过logger模块记录异常。

## 接口缺陷

- 异常响应逻辑不合理：异常时success设为true，与业务逻辑不符（异常应对应失败状态），且未指定500状态码，前端难以区分正常响应与异常响应。
- 同步写入性能问题：fs.writeFileSync为同步操作，高并发登录场景下会阻塞线程，影响接口响应速度，可能导致请求超时。
- 无请求体格式校验：未校验请求体是否为JSON格式、是否包含username和password字段，若请求体格式错误，会导致data为undefined，接口报错。