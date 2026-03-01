# /getMemberInfomation 接口文档

## 接口基本信息

|项目|详细说明|
|---|---|
|接口路径|/getMemberInfomation|
|请求方法|GET|
|核心功能|根据操作方（当前登录用户）的权限等级，获取所有用户信息，并根据权限差异屏蔽对应敏感字段（password、token）|
## 请求参数说明

### 请求头（Headers）

|参数名|必选|类型|说明|
|---|---|---|---|
|token|是|String|用户身份令牌，格式要求：`用户名~加密字符串`，用于识别当前登录用户的权限等级，解析后获取用户名以查询操作方权限|
### 请求体（Body）

本接口为GET请求，无需提交请求体（无请求参数），仅需通过请求头token验证操作方权限。

## 代码逻辑解析

- **用户数据读取**：通过自定义db模块的db("user")方法，读取所有用户数据，存储至user变量（后续不同权限分支按需重新读取或复用）。

- **操作方权限解析**：通过split("~")方法分割请求头中的token字符串，获取令牌的第一部分（用户名），根据该用户名查询操作方的权限等级（level）。

- **权限分支处理（核心逻辑）**：
    - **超级管理员（root）**：无需屏蔽任何敏感字段，直接返回所有用户的完整信息，响应状态码200，返回success标识和用户列表list。
    - **普通管理员（admin）**：仅屏蔽root权限用户的敏感字段（password、token设为空字符串），普通用户（member）信息不屏蔽，处理后返回用户列表。
    - **普通成员（member）及其他权限**：屏蔽所有用户的敏感字段（password、token设为空字符串），确保敏感信息不泄露，处理后返回用户列表。

- **响应返回**：所有权限分支均返回状态码200（请求成功），响应格式统一为JSON，包含success（成功标识）和list（处理后的所有用户信息列表）。
## 响应说明

### 成功响应（root权限示例）

```js
{
  "success": true,
  "list": {
    "rootUser": {
      "name": "rootUser",
      "level": "root",
      "password": "123456",  // 未屏蔽
      "token": "abc123",  // 未屏蔽
      //...
    },
    "adminUser": {
      "name": "adminUser",
      "level": "admin",
      "password": "654321",  // 未屏蔽
      "token": "def456",  // 未屏蔽
      //...
    }
  }
}
```

### 成功响应（admin权限示例）

```js
{
  "success": true,
  "list": {
    "rootUser": {
      "name": "rootUser",
      "level": "root",
      "password": "",  // 已屏蔽
      "token": "",     // 已屏蔽
      //...
    },
    "adminUser": {
      "name": "adminUser",
      "level": "admin",
      "password": "654321",  // 未屏蔽
      "token": "def456",  // 未屏蔽
      //...
    }
  }
}
```

### 成功响应（member权限示例）

```js
{
  "success": true,
  "list": {
    "rootUser": {
      "name": "rootUser",
      "level": "root",
      "password": "",  // 已屏蔽
      "token": "",     // 已屏蔽
      //...
    },
    "adminUser": {
      "name": "adminUser",
      "level": "admin",
      "password": "",  // 已屏蔽
      "token": "",     // 已屏蔽
      //...
    },
    "memberUser": {
      "name": "memberUser",
      "level": "member",
      "password": "",  // 已屏蔽
      "token": "",     // 已屏蔽
      //...
    }
  }
}
```

状态码：200（OK），表示请求成功，list字段返回处理后的所有用户信息列表，屏蔽规则随操作方权限变化。
## 接口缺陷
- 缺失用户存在性校验：未验证token解析出的用户名是否在数据库中存在，若用户名不存在，会导致user[用户名]为undefined，无法获取level字段，接口报错。

- 重复读取数据：admin和member分支重复调用db("user")读取用户数据，可复用首次读取的user变量，优化性能。

- 缺失异常处理：未捕获db模块读取失败等异常，接口稳定性差，异常时无错误响应。