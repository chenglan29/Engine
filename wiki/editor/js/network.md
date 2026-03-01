# visit(api, body, callback)

发送 GET/POST 请求

- api : 路由路径(前面不需要“/”)
- body : 请求体（不填时`visit(api, callback)`发送 GET 请求，填有时发送 POST 请求）
- callback : 处理返回信息，
    - visit内自动处理成JSON
    - visit内通过判断 success 的值确定是否执行 callback