app.get('/getUserList', (req, res) => {
    var user = db("user");
    res.status(200).json({
        success: true,
        userList: Object.keys(user)
    });
});