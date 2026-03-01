app.post('/getProject', (req, res) => {
    //此处需要验证是否拥有权限，以及是否存在该项目
    res.status(200).json({
        success: true,
        path: db("project")[req.body.project].path,
        log: db("project")[req.body.project].log,
        wsPort:db("config").wsPort
    });
});