const { createClient } = require("oicq");
const config = require("../config.json")

// your account
const uin = config.uin;
const bot = createClient(uin, {
    log_level: "debug", //日志级别设置为debug
    platform: 5, //登录设备选择为iPad
});

exports.bot = bot