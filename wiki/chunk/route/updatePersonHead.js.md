# /updatePersonHead 接口文档

## 接口基本信息

|项目|详细说明|
|---|---|
|接口路径|/updatePersonHead|
|请求方法|POST|
|核心功能|通过multer中间件处理用户头像上传，校验文件格式（仅支持图片）、文件大小（读取配置文件中的headSize限制），上传成功后覆盖用户原有头像文件，返回上传结果，包含异常捕获处理|
|数据交互格式|请求为multipart/form-data（文件上传格式），响应为JSON格式|
|依赖模块|multer（文件上传处理中间件）、db（自定义数据库模块，读取config配置中的头像大小限制）|
## multer上传配置说明（uploadHead）
接口通过multer实例uploadHead处理头像上传，配置包含存储路径、文件名、文件大小限制、文件格式过滤，具体配置逻辑如下：

```javascript
const uploadHead = multer({
    storage: multer.diskStorage({
        // 存储目录
        destination: (req, file, cb) => {
            cb(null, "./heads");
        },
        filename: (req, file, cb) => {
            cb(null, req.headers.token.split("~")[0]);
        }
    }),
    limits: { fileSize: db("config").headSize }, // 限制文件大小：5MB（注释标注，实际取config配置值）
    fileFilter: (req, file, cb) => {
        // 判断 mimetype 是否以 "image/" 开头，等效于 image/*
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // 允许所有图片类型上传
        } else {
            cb(new Error('仅支持图片格式的文件！'), false); // 拒绝非图片文件
        }
    }
});
```

### 存储配置（storage）

- **destination（存储目录）**：固定将上传的头像文件存储在项目根目录下的./heads文件夹中，回调函数cb(null, "./heads")指定存储路径，无异常时第一个参数传null。
      

- **filename（文件名）**：上传后的头像文件名固定为操作用户名，通过解析请求头token（格式为“用户名~token字符串”），用split("~")分割后取第一个元素作为文件名，覆盖原有同用户名的头像文件。

### 限制配置（limits）

- **fileSize（文件大小限制）**：限制单个上传文件的大小，大小值读取db("config")中的headSize字段，超过该大小的文件会被拒绝上传。
      

### 文件过滤（fileFilter）

- 校验上传文件的mimetype（文件类型标识），仅允许以“image/”开头的文件（即所有图片格式，如image/jpg、image/png、image/gif等）。

- 若为非图片格式文件，触发错误回调，抛出“仅支持图片格式的文件！”的错误信息，拒绝文件上传；若为图片格式，允许上传。

## 请求参数说明

### 请求头（Headers）

|参数名|必选|类型|说明|
|---|---|---|---|
|token|是|String|操作用户的身份令牌，格式为“用户名~token字符串”，用于解析用户名，作为头像文件名|
### 请求体（Form Data）

|参数名（key）|必选|类型|说明|
|---|---|---|---|
|avatar|是|File（文件）|需上传的用户头像文件，仅支持图片格式（由multer的fileFilter校验），大小不超过config配置的headSize值，对应multer.single('avatar')中的字段名|

## 代码逻辑解析

- **中间件调用**：接口调用uploadHead.single('avatar')中间件，指定单次仅上传一个文件，且文件对应的Form Data字段名为avatar，由该中间件完成文件的接收、校验、存储。
      

- **异常捕获机制**：接口整体包裹在try-catch块中，捕获上传过程中（如文件格式错误、文件大小超标）及接口执行过程中的所有异常，统一返回错误响应。
      

- **文件存在性校验**：
    - multer中间件处理完成后，若未接收到任何文件（如未选择文件直接提交），req.file会为undefined。
    - 此时返回状态码200，success设为false，提示“没有文件！”，并通过return终止后续代码执行，避免重复响应。

- **上传成功响应**：
    - 若文件上传成功（通过multer的格式、大小校验，且成功存储到./heads目录），req.file会包含上传文件的详细信息（如路径、大小、格式等）。
    - 此时返回状态码200，success设为true，无额外提示信息，仅告知前端上传成功。

- **异常响应处理**：
    - 若上传过程中出现异常（如文件格式非图片、文件大小超标、token解析错误等），会触发catch块。
    - 返回状态码200，success设为false，message为异常信息（如multer过滤非图片文件时抛出的“仅支持图片格式的文件！”），告知前端具体错误原因。

## 六、响应说明

### 6.1 成功响应

```json
{
  "success": true
}
```

状态码：200（OK），表示头像文件上传成功，已存储到./heads目录，文件名为token解析出的用户名。

### 6.2 失败响应

|状态码|响应内容|错误原因|
|---|---|---|
|200|{ "success": false, "message": "没有文件！" }|未选择任何文件，直接提交上传请求，req.file为undefined|
|200|{ "success": false, "message": "仅支持图片格式的文件！" }|上传的文件非图片格式，被multer的fileFilter拒绝|
|200|{ "success": false, "message": "File too large" }|上传的图片文件大小超过db("config").headSize配置的限制|
|200|{ "success": false, "message": "具体异常信息" }|其他异常（如token解析错误、存储目录不存在等）|
## 接口缺陷

- 状态码设计不规范：所有响应均返回200状态码，失败场景未使用4xx（客户端错误）、5xx（服务器错误）状态码，不符合HTTP规范。

- 无上传成功详情：成功响应仅返回success: true，前端无法获取头像文件路径、大小等信息。

- 未处理存储目录异常：若./heads目录不存在，multer会抛出“ENOENT: no such file or directory”错误，接口未做容错处理。

- 无文件后缀校验：仅校验文件mimetype，未校验文件后缀，可能存在恶意文件伪装成图片格式上传的风险。
