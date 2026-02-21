app.post('/submitProject', (req, res) => {
    logger.debug(req.body)
    res.status(200).json({ success: true });
    //需要记录代码
});