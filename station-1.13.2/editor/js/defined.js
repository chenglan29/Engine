var globalAttributeList = {
    "访问元素的键盘快捷键": {
        "type": "text",
        "mapping": "accesskey"
    },
    "类名": {
        "type": "text",
        "mapping": "class"
    },
    "可编辑": {
        "type": "checkbox",
        "mapping": "contenteditable",
        "true": "true",
        "false": "false",
        "default": false
    },
    "文本方向": {
        "type": "select",
        "option": {
            "从左到右": "ltr",
            "从右到左": "rtl",
            "自动匹配": "auto"
        },
        "default": "auto",
        "mapping": "dir"
    },
    "可拖动": {
        "type": "select",
        "option": {
            "可": "true",
            "不可": "false",
            "浏览器默认": "auto"
        },
        "default": "auto",
        "mapping": "draggable"
    },
    "隐藏": {
        "type": "checkbox",
        "mapping": "hidden",
        "true": "hidden",
        "false": "",
        "default": false
    },
    "样式": {
        "type": "text",
        "mapping": "style"
    },
    "提示文字": {
        "type": "text",
        "mapping": "title"
    }
}
var attributeList = {
    "内容": {
        "type": "longText"
    },
    "下载的文件的名字": {
        "type": "text",
        "mapping": "download"
    },
    "目标URL": {
        "type": "text",
        "mapping": "href"
    },
    "打开位置": {
        "type": "select",
        "option": {
            "新窗口": "_blank",
            "父窗口": "_parent",
            "当前窗口": "_self",
            "当前窗体": "_top"
        },
        "default": "_self",
        "mapping": "target"
    },
    "替代文字": {
        "type": "text",
        "mapping": "alt"
    },
    "名字": {
        "type": "text",
        "mapping": "name"
    },
    "提示字": {
        "type": "text",
        "mapping": "placeholder"
    },
    "引用来源": {
        "type": "text",
        "mapping": "cite"
    },
    "规定区域的坐标": {
        "type": "text",
        "mapping": "coords"
    },
    "引用的 datalist ID": {
        "type": "text",
        "mapping": "list"
    },
    "值": {
        "type": "text",
        "mapping": "value"
    },
    "数字最大值": {
        "type": "number",
        "mapping": "max"
    },
    "长度最大值": {
        "type": "number",
        "mapping": "maxlength"
    },
    "数字最小值": {
        "type": "number",
        "mapping": "min"
    },
    "字符可见宽度": {
        "type": "number",
        "mapping": "size"
    },
    "可见选项数": {
        "type": "number",
        "mapping": "size"
    },
    "形状": {
        "type": "select",
        "option": {
            "默认": "default",
            "矩形": "rect",
            "圆形": "_self",
            "多": "poly"
        },
        "default": "默认",
        "mapping": "shape"
    },
    "是否自动播放": {
        "type": "checkbox",
        "mapping": "autoplay",
        "true": "autoplay",
        "false": "",
        "default": false
    },
    "只读": {
        "type": "checkbox",
        "mapping": "readonly",
        "true": "readonly",
        "false": "",
        "default": false
    },
    "是否接受多个值": {
        "type": "checkbox",
        "mapping": "multiple",
        "true": "multiple",
        "false": "",
        "default": false
    },
    "是否显示控件": {
        "type": "checkbox",
        "mapping": "controls",
        "true": "controls",
        "false": "",
        "default": false
    },
    "是否自动循环": {
        "type": "checkbox",
        "mapping": "loop",
        "true": "loop",
        "false": "",
        "default": false
    },
    "是否静音": {
        "type": "checkbox",
        "mapping": "muted",
        "true": "muted",
        "false": "",
        "default": false
    },
    "预加载模式": {
        "type": "select",
        "option": {
            "载入整个文件": "auto",
            "载入元数据": "rect",
            "不载入": "none"
        },
        "default": "载入整个文件",
        "mapping": "preload"
    },
    "加载模式": {
        "type": "select",
        "option": {
            "立即加载": "eager",
            "延迟加载": "lazy"
        },
        "default": "立即加载",
        "mapping": "preload"
    },
    "图标": {
        "type": "text",
        "mapping": "src"
    },
    "文件URL": {
        "type": "text",
        "mapping": "src"
    },
    "封面URL": {
        "type": "text",
        "mapping": "poster"
    },
    "长": {
        "type": "number",
        "mapping": "width"
    },
    "高": {
        "type": "number",
        "mapping": "height"
    },
    "文本方向": {
        "type": "select",
        "option": {
            "从左向右": "ltr",
            "从右向左": "rtl"
        },
        "default": "从右向左"
    },
    "轨道类型": {
        "type": "select",
        "option": {
            "说明": "captions",
            "章节": "chapters",
            "描述": "descriptions",
            "脚本内容": "metadata",
            "字幕": "subtitles"
        },
        "default": "字幕"
    },
    "页面加载时自动获取焦点": {
        "type": "checkbox",
        "mapping": "autofocus",
        "true": "autofocus",
        "false": "",
        "default": false
    },
    "01状态": {
        "type": "checkbox",
        "mapping": "checked",
        "true": true,
        "false": false,
        "default": false
    },
    "启用浏览器预测提示": {
        "type": "checkbox",
        "mapping": "autocomplete",
        "true": "on",
        "false": "off",
        "default": false
    },
    "禁用": {
        "type": "checkbox",
        "mapping": "disabled",
        "true": "disabled",
        "false": "",
        "default": false
    },
    "是否硬性换行": {
        "type": "checkbox",
        "mapping": "warp",
        "true": "hard",
        "false": "soft",
        "default": false
    },
    "轨道语言":{
        "type": "text",
        "mapping": "srclang"
    },
    "可见列数":{
        "type": "number",
        "mapping": "cols"
    },
    "可见行数":{
        "type": "number",
        "mapping": "rows"
    },
    "横跨列数":{
        "type": "number",
        "mapping": "span"
    },
    "跨越列数":{
        "type": "number",
        "mapping": "colspan"
    },
    "跨越行数":{
        "type": "number",
        "mapping": "rowspan"
    },
    "删除时间": {
        "type": "text"
    },
    "规定文件类型": {
        "type": "text"
    },
    //Engine特有:
    "是否使用HTML5": {
        "type": "checkbox",
        "default": true
    },
    //<meta charset="" />
    "字符集": {
        "type": "text"
    },
    //<title></title>
    "页面标题": {
        "type": "text"
    },
    //<address></address>
    "游戏作者联系信息": {
        "type": "longText"
    },
    //<base>
    "页面上所有链接的默认 URL 和默认目标":{
        "type": "longText"
    },
    //<link rel="icon" href=""/>
    "页面图标": {
        "type": "text"
    },
    //<link rel="icon" href=""/>
    "类型": {
        "type": "none"
    },
    //<link rel="icon" href=""/>
    "path": {
        "type": "none"
    }
}
var tagList = {
    "注释": {
        "allow": ["内容"],
        "deny": "globalAttributeList"
    },
    "超文本链接": {
        "mapping": "a",
        "allow": ["下载的文件的名字", "目标URL", "打开位置"],
        "child": true
    },
    "图像映射": {
        "mapping": "area",
        "allow": ["替代文字", "规定区域的坐标", "形状", "目标URL", "打开位置"]
    },
    "文字": {
        "allow": ["内容"],
        "deny": "globalAttributeList"
    },
    "源": {
        "mapping": "source",
        "allow": ["文件URL"]
    },
    "文章区域": {
        "mapping": "article",
        "child": true
    },
    "侧边栏": {
        "mapping": "aside",
        "child": true
    },
    "有序列表": {
        "mapping": "ol",
        "child": true
    },
    "无序列表": {
        "mapping": "ul",
        "child": true
    },
    "小字": {
        "mapping": "small",
        "child": true
    },
    "上标字": {
        "mapping": "sub",
        "child": true
    },
    "下标字": {
        "mapping": "sup",
        "child": true
    },
    "表格": {
        "mapping": "table",
        "child": true
    },
    "表格单元": {
        "mapping": "td",
        "allow":["跨越行数","跨越列数"],
        "child": true
    },
    "轨道": {
        "mapping": "track",
        "allow":["文件URL","轨道语言","轨道类型"],
    },
    "表格行": {
        "mapping": "tr",
        "child": true
    },
    "单词": {
        "mapping": "span",
        "child": true
    },
    "音频": {
        "mapping": "audio",
        "allow": ["是否自动播放","是否显示控件","是否自动循环","是否静音","预加载模式","文件URL"],
        "child": true
    },
    "长引用": {
        "mapping": "blockquote",
        "allow": ["引用来源"],
        "child": true
    },
    "粗体": {
        "mapping": "b",
        "child": true
    },
    "缩写": {
        "mapping": "abbr",
        "child": true
    },
    "表格标题": {
        "mapping": "caption",
        "child": true
    },
    "文章引用": {
        "mapping": "cite",
        "child": true
    },
    "计算机代码文本": {
        "mapping": "code"
    },
    "表格格式化定义": {
        "mapping": "col",
        "allow":["横跨列数"]
    },
    "表格格式化": {
        "mapping": "colgroup",
        "child": true
    },
    "预设输入值": {
        "mapping": "datalist",
        "child": true
    },
    "按钮": {
        "mapping": "button",
        "allow": ["页面加载时自动获取焦点","禁用"],
        "child": true
    },
    "带删除记号的文字": {
        "mapping": "del",
        "allow": ["引用来源","删除时间"],
        "child": true
    },
    "节": {
        "mapping": "div",
        "child": true
    },
    "独立流": {
        "mapping": "figure",
        "child": true
    },
    "1号标题": {
        "mapping": "h1",
        "child": true
    },
    "2号标题": {
        "mapping": "h2",
        "child": true
    },
    "3号标题": {
        "mapping": "h3",
        "child": true
    },
    "4号标题": {
        "mapping": "h4",
        "child": true
    },
    "5号标题": {
        "mapping": "h5",
        "child": true
    },
    "6号标题": {
        "mapping": "h6",
        "child": true
    },
    "斜体字": {
        "mapping": "i",
        "child": true
    },
    "画布": {
        "mapping": "canvas",
        "allow": ["长","高"],
        "child": true
    },
    "列表项目": {
        "mapping": "li",
        "child": true
    },
    "外链样式表": {
        "allow": ["目标URL"]
    },
    "内嵌框架": {
        "mapping": "iframe",
        "allow": ["长","高","文件URL"],
        "child": true
    },
    "图片": {
        "mapping": "img",
        "allow": ["长","高","文件URL","加载模式","替代文字"],
        "child": true
    },
    "换行": {
        "mapping": "br"
    },
    "水平线": {
        "mapping": "hr"
    },
    "选项列表": {
        "mapping": "option",
        "allow": ["禁用","值","页面加载时自动获取焦点","是否接受多个值","可见选项数"],
        "child": true
    },
    "选项": {
        "mapping": "option",
        "allow": ["禁用","值"],
        "child": true
    },
    "选项组": {
        "mapping": "option",
        "allow": ["禁用"],
        "child": true
    },
    "段落": {
        "mapping": "p",
        "child": true
    },
    "短的引用": {
        "mapping": "q",
        "child": true
    },
    "视频": {
        "mapping": "video",
        "allow":["是否自动播放","是否显示控件","高","长","是否自动循环","是否静音","封面URL","文件URL","宽","预加载模式"],
        "child": true
    },
    "注音器": {
        "child": true
    },
    "进度条": {
        "mapping": "progress",
        "allow": ["数字最大值","值"],
        "child": true
    },
    "文件上传": {
        "mapping": "input.file",
        "allow": ["规定文件类型","页面加载时自动获取焦点","禁用","是否接受多个值"]
    },
    "图片按钮": {
        "mapping": "input.image",
        "allow": ["文件URL","替代文字","页面加载时自动获取焦点","禁用","高","长"]
    },
    "复选框": {
        "mapping": "input.checkbox",
        "allow": ["只读","页面加载时自动获取焦点","01状态","禁用"]
    },
    "拾色器": {
        "mapping": "input.color",
        "allow": ["只读","启用浏览器预测提示","页面加载时自动获取焦点","禁用","值"]
    },
    "YMD日期选择器": {
        "mapping": "input.date",
        "allow": ["只读","页面加载时自动获取焦点","禁用","数字最大值","数字最小值","值"]
    },
    "YM日期选择器": {
        "mapping": "input.month",
        "allow": ["只读","页面加载时自动获取焦点","禁用","数字最大值","数字最小值","值"]
    },
    "YW日期选择器": {
        "mapping": "input.week",
        "allow": ["值","只读","页面加载时自动获取焦点","禁用","数字最大值","数字最小值"]
    },
    "HM时间选择器": {
        "mapping": "input.time",
        "allow": ["值","只读","页面加载时自动获取焦点","禁用","数字最大值","数字最小值"]
    },
    "邮箱输入框": {
        "mapping": "input.email",
        "allow": ["值","字符可见宽度","只读","提示字","启用浏览器预测提示","页面加载时自动获取焦点","禁用","引用的 datalist ID","长度最大值","是否接受多个值"]
    },
    "数字输入框": {
        "mapping": "input.number",
        "allow": ["值","只读","提示字","页面加载时自动获取焦点","禁用","引用的 datalist ID","数字最大值","数字最小值","长度最大值"]
    },
    "密码输入框": {
        "mapping": "input.password",
        "allow": ["值","字符可见宽度","只读","提示字","启用浏览器预测提示","页面加载时自动获取焦点","禁用","引用的 datalist ID","长度最大值"]
    },
    "URL输入框": {
        "mapping": "input.url",
        "allow": ["值","字符可见宽度","只读","提示字","启用浏览器预测提示","页面加载时自动获取焦点","禁用","引用的 datalist ID","长度最大值"]
    },
    "电话输入框": {
        "mapping": "input.tel",
        "allow": ["值","字符可见宽度","只读","提示字","启用浏览器预测提示","页面加载时自动获取焦点","禁用","引用的 datalist ID","长度最大值"]
    },
    "文本输入框": {
        "mapping": "input.text",
        "allow": ["值","字符可见宽度","只读","提示字","启用浏览器预测提示","页面加载时自动获取焦点","禁用","引用的 datalist ID","长度最大值"]
    },
    "范围选择器": {
        "mapping": "input.range",
        "allow": ["值","只读","启用浏览器预测提示","页面加载时自动获取焦点","禁用","数字最大值","数字最小值"]
    },
    "选择输入器": {
        "mapping": "input.radio",
        "allow": ["只读","页面加载时自动获取焦点","禁用","名字"]
    },
    "长文本输入框": {
        "mapping": "textarea",
        "allow": ["可见列数","可见行数","是否硬性换行","只读","提示字","页面加载时自动获取焦点","禁用","长度最大值"]
    },
    "JS代码": {
        "allow": ["内容"],
        "deny": "globalAttributeList"
    },
    "外部JS": {
        "allow": ["文件URL"],
        "deny": "globalAttributeList"
    },
    "CSS代码": {
        "allow": ["内容"],
        "deny": "globalAttributeList"
    },
    //Engine特有:
    "主程序": {
        "create": false,
        "allow": ["是否使用HTML5", "字符集", "页面标题","游戏作者联系信息","页面上所有链接的默认 URL 和默认目标","图标"],
        "child": true,
    }
}