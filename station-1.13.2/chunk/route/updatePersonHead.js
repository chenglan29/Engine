const uploadHead = multer({
    storage: multer.diskStorage({
        // 存储目录
        destination: (req, file, cb) => {
            cb(null, "./heads");
        },
        filename: (req, file, cb) => {
            cb(null, req.headers.token.split("~")[0]);
        }
    }),
    limits: { fileSize: db("config").headSize }, // 限制文件大小：5MB
    fileFilter: (req, file, cb) => {
        // 判断 mimetype 是否以 "image/" 开头，等效于 image/*
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // 允许所有图片类型上传
        } else {
            cb(new Error('仅支持图片格式的文件！'), false); // 拒绝非图片文件
        }
    }
});
app.post('/updatePersonHead', uploadHead.single('avatar'), (req, res) => {
    try {
        // req.file 包含上传文件的所有信息
        if (!req.file) {
            return res.status(200).json({
                success: false,
                message: "没有文件！"
            });
        }
        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(200).json({
            success: false,
            message: err.message
        });
    }
});