app.get('/getProjectList', (req, res) => {
    res.status(200).json({
        success: true,
        projectList: db("project")
    });
});