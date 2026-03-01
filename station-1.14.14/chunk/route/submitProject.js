app.post('/submitProject', (req, res) => {
    logger.debug(req.body)
    var f = 0;
    var project = db("project");
    if (req.body.projectName == "") {
        res.status(200).json({
            success: false,
            message: "项目名字不能为空"
        });
    }
    else {
        project.forEach(item => {
            if (item.name == req.body.projectName) {
                f = 1;
                return;
            }
        })
        if (f == 1) {
            res.status(200).json({
                success: false,
                message: "项目重名"
            });
        }
        else {
            project.push({
                "name": req.body.projectName,
                "desc": req.body.projectDescription,
                "creator":req.headers.token.split("~")[0],
                "contributor": [],
                "date": new Date(),
                "type":"Web",
                "path": [
                    {
                        "类型":"主程序"
                    }
                ],
                "log": [
                    []
                ]
            })
            fs.writeFileSync("./db/project.json",JSON.stringify(project))
        }
    }
    if(f == 0)res.status(200).json({ success: true });
    //需要记录代码
});