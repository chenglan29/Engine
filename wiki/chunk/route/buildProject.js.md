# 解释器
核心功能，将工程 JSON 文件转为 HTML 等文件

启用方法是 post /buildProject
body:
```json
{
    "timestamp":"时间戳，用于生成测试页面",
    "project":"项目名"
}
```

编程原理:
读取 ./editor/js/defined.js 中的属性表和标签表，

检测是否有 mapping ，有则直接映射
检测 child 是否为 true ，有则表示双标签
（create 是主程序特有的，当 create 为 false 表示无法创建这个标签）

其中 attribute(obj) 用于解析属性

tree(obj,level) 用于解析子元素

tab(level) 根据层级生成缩进