储存解释时用的标签表和属性表

其中
- globalAttributeList 为全局属性表
- attributeList 为普通属性表
- tagList 为标签表
# 属性表
属性表每一项有几种格式
```json
{
    "type": "checkbox",
    "mapping": "映射属性",
    "true": "true",
    "false": "false",
    "default": false
}
```
- type : 在编辑界面显示为复选框
- mapping : 映射值(可选)，解释的时候如果存在这个则直接映射属性名
- true : 表示复选框选中时的值
- false : 表示复选框未选中时的值
- default : 复选框默认状态

```json
{
    "type": "text",
    "mapping": "映射属性"
}
```
- type : 在编辑界面显示为文本输入框
- mapping : 映射值(可选)，解释的时候如果存在这个则直接映射属性名

```json
{
    "type": "longText",
    "mapping": "映射属性"
}
```
- type : 在编辑界面显示为可换行的文本输入框
- mapping : 映射值(可选)，解释的时候如果存在这个则直接映射属性名

```json
{
    "type": "select",
    "option": {
        "从左到右": "ltr",
        "从右到左": "rtl",
        "自动匹配": "auto"
    },
    "default": "auto",
    "mapping": "dir"
}
```
- type : 在编辑界面显示为选项
- option : 选项映射
    - key : 显示值
    - value : 实际储存值
- mapping : 映射值(可选)，解释的时候如果存在这个则直接映射属性名
- default : 选项默认显示值(key)

```json
{
    "type": "number",
    "mapping": "映射属性"
}
```
- type : 在编辑界面显示为数字输入框
- mapping : 映射值(可选)，解释的时候如果存在这个则直接映射属性名
# 标签表
```json
{
    "create": false,
    "allow": ["是否使用HTML5", "字符集", "页面标题","游戏作者联系信息","页面上所有链接的默认 URL 和默认目标","图标"],
    "child": true,
    "mapping": "input.range",
    "deny": "globalAttributeList"
}
```
- create(可选) : 在编辑界面的添加对象中是否可以显示(true/false)
- allow : 可用的属性
- child(可选) : 是否可以添加对象到子集(true/false/留空)
- mapping(可选) : 映射值，解释的时候如果存在这个则直接映射标签名
- deny(可选) : 不可用的属性，可能的值有
 - globalAttributeList : 全局属性不可用