# JSON文件读取函数文档

## 文件概述

该函数通过 CommonJS 模块化导出供其他文件调用，核心功能是根据传入的文件名，读取./db 下的 JSON 文件，并将文件内容解析为 JavaScript 对象返回，适用于系统配置读取、数据持久化读取等场景，简化 JSON 文件的读取与解析操作。

## 函数核心信息
|项目|详细说明|
|---|---|
|参数说明|name：String 类型，必传，指定要读取的 JSON 文件名（无需携带 .json 后缀）|
|返回值|Object 类型（JSON 解析后的 JavaScript 对象），对应 JSON 文件中的内容|

## 代码逐段解析

### 函数整体代码（带注释解析）
```js
// 引入Node.js内置文件系统模块（fs），用于读取本地文件
const fs = require("fs");
// 模块化导出函数，接收参数 name（要读取的JSON文件名，无后缀）
module.exports = (name) => {
    // 1. 读取db目录下指定名称的JSON文件，转为字符串；2. 将JSON字符串解析为JavaScript对象并返回
    return JSON.parse(fs.readFileSync(`db/${name}.json`).toString());
}
```
## 调用示例
```js
// 引入JSON文件读取函数
const db = require('./db.js');

// 调用函数，读取 ./db/config.json 文件（name参数传入"config"，无需加.json后缀）
const configData = db("config");
console.log(configData);
/*示例输出：
{
    "port": 80,
    "logPath": "./log/",
    "logMaxSize": 10485760,
    "logBackups": 200,
    "tokenLength":1024,
    "headSize": 10485760,
    "wsPort":81
}
*/

// 调用函数，读取 ./db/user.json 文件
const userData = db("user");
console.log(userData);
/*示例输出：
{
    "root": {
        "password": "root",
        "level": "root",
        "email": "",
        "phone": "",
        "token": "1"
    }
}
*/
```
## 注意事项

- 参数要求：name 必须为字符串类型，且需与 db 目录下的 JSON 文件名（不含后缀）完全一致，若传入错误的文件名、非字符串类型，会导致文件读取失败，抛出异常。

- 文件路径要求：函数固定读取项目根目录下的 db 文件夹，需确保项目根目录存在 db 文件夹，且目标 JSON 文件存在于该文件夹内，否则会抛出“文件不存在”的异常。

- 同步读取特性：使用 fs.readFileSync() 同步读取文件，若读取的文件过大或磁盘IO较慢，会阻塞服务器主线程，影响系统响应速度，建议在非高频读取、小文件读取场景使用；高频读取场景可替换为异步读取方法（如fs.readFile()）。

- JSON 格式要求：目标文件必须是合法的 JSON 格式，若文件内容存在语法错误（如逗号遗漏、引号不匹配），JSON.parse() 会抛出解析异常，需确保 JSON 文件格式正确。

- 异常处理：当前函数未添加异常捕获逻辑，文件读取失败、JSON 解析失败时会直接抛出异常，建议调用时添加 try-catch 语句捕获异常，避免程序崩溃。

## 功能扩展建议（可选）

- 异常捕获：添加 try-catch 逻辑，捕获文件读取和 JSON 解析过程中的异常，返回默认值或抛出友好的错误提示，提升函数健壮性。

- 路径可配置：修改函数参数，允许传入自定义文件目录，不再固定读取 db 目录，提升函数灵活性。

- 异步优化：将同步读取 fs.readFileSync() 替换为异步读取 fs.readFile() 或使用 async/await 语法，避免阻塞主线程，适配高频读取场景。

- 默认值设置：当文件不存在或解析失败时，返回预设的默认对象，避免程序因异常中断。

- 文件后缀兼容：添加逻辑，允许 name 参数携带 .json 后缀，自动处理后缀重复问题，提升调用便捷性。
