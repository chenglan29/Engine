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
读取 ./editor/js/build-core.js 中的属性表和标签表，

检测是否有 mapping ，有则直接映射
检测 child 是否为 true ，有则表示双标签
（create 是主程序特有的，当 create 为 false 表示无法创建这个标签）

其中 build_attribute(obj) 用于解析属性

build_tree(obj,level) 用于解析子元素

tab(level) 根据层级生成缩进

需要注意的是(2026/03/08更新内容)
build_tree,build_attribute 函数生成时会检查对应的表有没有对应的函数定义，以便多样化的构建
比如
```js
{
    "文字": {
        "allow": ["内容"],
        "deny": "globalAttributeList",
        "tree":(res,item)=>{
            return {
                "res":res + item["内容"] + "\n"
            }
        }
    }
}
```
其中，构建页面时系统会向上述的`"tree":(res,item,level)=>`
传入`res`(构建结果池)和`item`(结构树中的该节点)以及`level`该节点的层级(用于缩进)

`return`所返回的是一个对象包括`res`,`item`

如果`res`存在那么它将会用于替代系统中的`res`

`item`也是同理
