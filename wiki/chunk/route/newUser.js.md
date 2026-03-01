# /newUser 接口文档

## 接口基本信息

|项目|详细说明|
|---|---|
|接口路径|/newUser|
|请求方法|POST|
|核心功能|接收新用户注册请求，校验用户名是否存在、是否为空，补全token和密码（若为空），创建用户数据并同步写入文件，生成用户头像备份，返回注册结果|
|数据交互格式|请求、响应均为JSON格式|
## 请求参数说明
### 请求体（Body）

|参数名|必选|类型|说明|
|---|---|---|---|
|username|是|String|新用户用户名，作为用户唯一标识，不可为空、不可与已有用户重复，对应数据库user集合的键名|
|password|否|String|用户密码，若为空，系统会自动生成16位随机字段作为默认密码（通过token.js生成）|
|token|否|String|用户token，若为空，系统会结合config配置的tokenLength生成token（通过token.js生成）|
|email|否|String|用户邮箱，可选参数，无默认值，为空则存储为undefined|
|phone|否|String|用户手机号，可选参数，无默认值，为空则存储为undefined|

## 代码逻辑解析

- **用户存在性校验（代码注释标注需实现）**：读取user集合数据，判断请求体中username对应的用户是否已存在（通过user[req.body.username]是否为undefined判断），若已存在，返回状态码200，提示“用户名已存在”，注册失败。
      

- **用户名非空校验**：若用户不存在，进一步校验username是否为空，若为空，返回状态码200，提示“用户名不能为空”（注：代码中message拼写错误，为messsage），注册失败。
      

- **token与密码补全**：
 - 若请求体中token为空，通过require("./token.js")引入token生成模块，结合config配置中的tokenLength，生成用户token并赋值给req.body.token。
 - 若请求体中password为空，通过token.js模块生成16位字符串，作为默认密码赋值给req.body.password。

- **用户数据创建**：在user集合中，以请求体中的username为键名，创建用户对象，包含email、phone、token、password、level五个字段，其中level固定为“member”（普通成员权限），email和phone为请求体传入的可选值（为空则为undefined）。
      

- **文件写入操作**：
 - 读取./heads/backup路径下的备份头像文件，同步写入./heads/目录下，以请求体中的username为文件名（生成用户专属头像）。
 - 将更新后的user集合（包含新创建的用户），通过fs.writeFileSync同步写入./db/user.json文件，更新用户数据库。

- **注册成功响应**：返回状态码200，success设为true，无额外提示信息，标识用户注册成功。

## 响应说明

### 成功响应

```json
{
  "success": true
}
```

状态码：200（OK），表示用户注册成功，已创建用户数据、生成用户头像并更新数据库。

### 失败响应

|状态码|响应内容|错误原因|
|---|---|---|
|200|{ "success": false, "message": "用户名已存在" }|请求的username在user集合中已存在，不可重复注册|
|200|{ "success": false, "message": "用户名不能为空" }|请求体中username字段为空|

状态码：无默认异常状态码（建议优化为500），接口执行过程中出现异常时会直接报错，无对应响应信息。

## 接口缺陷

- 响应状态码不规范：成功、失败响应均使用200状态码，不符合HTTP状态码规范，前端难以区分注册结果（建议失败用400/409，异常用500）。

- 无请求体校验：未校验请求体格式、必填参数（username、name），参数缺失或格式错误会导致接口报错（如name缺失会导致fs.writeFileSync路径错误）。

- 同步写入性能问题：fs.writeFileSync为同步操作，高并发场景下阻塞线程，影响接口响应速度，可能导致请求超时。

- 无参数合法性校验：未校验email、phone格式是否合法，未限制username、password的长度，可能导致无效数据存入数据库。