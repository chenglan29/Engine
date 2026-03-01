log4js.configure({
    appenders: {
        System: {
            type: "file",
            filename: `${db("config").logPath}${new Date().getTime()}.log`,
            maxLogSize: db("config").logMaxSize,
            backups: db("config").logBackups
        },
        Console: { type: "console" },
    },
    categories: { default: { appenders: ["System", "Console"], level: "debug" } },
});
var logger = log4js.getLogger("System");