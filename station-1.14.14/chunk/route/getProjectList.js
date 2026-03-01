app.get('/getProjectList', (req, res) => {
    var temp = db("project");
    Object.keys(temp).forEach(item=>{
        temp[item].path = {};
    })
    res.status(200).json({
        success: true,
        projectList: temp
    });
});