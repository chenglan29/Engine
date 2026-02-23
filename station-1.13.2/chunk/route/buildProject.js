const fs = require("fs");
var tab = (level) => {
    var result = "";
    for (var i = 0; i < level; i++) {
        result += "    ";
    }
    return result;
}
tree = (obj, level) => {
    var res = "";
    // logger.debug(obj)
    obj.forEach(item => {
        if (item == null) {
            //不处理
        }
        else {
            var type = item["类型"];
            if (tagList[type] != undefined && tagList[type].mapping != undefined) {
                if (tagList[type].child == true) {
                    //双标签处理
                    res += tab(level) + `<${tagList[type].mapping} ${attribute(item)}>\n`;
                    res += tree(item.path, level + 1);
                    res += tab(level) + `</${tagList[type].mapping}>\n`

                }
                else {
                    res += tab(level) + `<${tagList[type].mapping} ${attribute(item)} />\n`;
                    //单标签处理
                }
            }
            else if (type == "文字") {
                res += item["内容"];
            }
            else if (type == "JS代码") {
                res += tab(level) + `<script>\n`;
                res += item["内容"] + "\n";
                res += tab(level) + `</script>\n`;
            }
            else if (type == "外部JS" && item["文件URL"] != undefined) {
                res += tab(level) + `<script src="${item["文件URL"]}"></script>\n`;
            }
            else if (type == "CSS代码") {
                res += tab(level) + `<style>\n`;
                res += item["内容"] + "\n";
                res += tab(level) + `</style>\n`;
            }
            else if (type == "注释") {
                res += tab(level) + `<!-\n`;
                res += item["内容"] + "\n";
                res += tab(level) + `-->\n`;
            }
        }
    })
    return res;
}
attribute = (obj) => {
    var res = "";
    // logger.debug(obj)
    Object.keys(obj).forEach(item => {
        var attributeInfo;
        if (item == "类型" || item == "path") {
            //不解释
        }
        if (attributeList[item] != undefined) attributeInfo = attributeList[item];
        else if (globalAttributeList[item] != undefined) {
            attributeInfo = globalAttributeList[item];
        }

        // logger.debug(attributeInfo);
        if (attributeInfo.mapping != undefined && obj[item] != "") {
            res += attributeInfo.mapping + "=";
            if (attributeInfo.type == "text") res += `"${obj[item]}" `;
            else if (attributeInfo.type == "checkbox") {
                if (attributeInfo.true != undefined && obj[item] == true) res += `"${attributeInfo.true}" `;
                else if (attributeInfo.false != undefined && obj[item] == false) res += `"${attributeInfo.false}" `;
                else res += `"${obj[item]}" `;
            }
            else if (attributeInfo.type == "select") {
                res += `"${obj[item]}" `;
            }
        }
    })
    return res;
}
app.post('/buildProject', (req, res) => {
    logger.debug(req.body)
    res.status(200).json({
        success: true
    });
    if (fs.existsSync(`./debug/${req.body.project}/`) == false) fs.mkdirSync(`./debug/${req.body.project}/`);
    fs.mkdirSync(`./debug/${req.body.project}/${req.body.timestamp}`);
    var project = db("project")[req.body.project];
    if (project.type == "Web") {
        logger.debug(project)
        var res = "";
        res += `<!--name: ${project.name} -->\n`;
        res += `<!--description: ${project.description} -->\n`;
        res += `<!--creator: ${project.creator} -->\n`;
        res += `<!--version: ${project.version} -->\n`;
        if (project.path[0]["是否使用HTML5"] != undefined && project.path[0]["是否使用HTML5"] != false)
            res += `<!DOCTYPE HTML>\n`;
        res += `<html>\n`;
        res += tab(1) + `<head>\n`;
        if (project.path[0]["字符集"] != undefined)
            res += tab(2) + `<meta charset="${project.path[0]["字符集"]}" />\n`;
        if (project.path[0]["页面标题"] != undefined)
            res += tab(2) + `<title>${project.path[0]["页面标题"]}</title>\n`;
        if (project.path[0]["页面上所有链接的默认 URL 和默认目标"] != undefined)
            res += tab(2) + `<base href="${project.path[0]["页面上所有链接的默认 URL 和默认目标"]}">\n`;
        if (project.path[0]["图标"] != undefined)
            res += tab(2) + `<link rel="icon" href="${project.path[0]["页面上所有链接的默认 URL 和默认目标"]}" />\n`;
        res += tab(1) + `</head>\n`;
        res += tab(1) + `<body ${attribute(project.path[0])}>\n`;
        if (project.path[0]["游戏作者联系信息"] != undefined)
            res += tab(2) + `<address>${project.path[0]["游戏作者联系信息"]}</address>\n`;
        res += tree(project.path[0].path, 2);
        res += tab(1) + `</body>\n`;
        res += `</html>\n`;
        logger.info(res);
        fs.writeFileSync(`./debug/${req.body.project}/${req.body.timestamp}/index.html`, res);
    }
});