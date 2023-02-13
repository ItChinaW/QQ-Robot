const config = require("./config.json");
const {loginDevice} = require("./events/login");
const events = require("./events/index");
const {bot} = require("./events/global");

// 随机函数
require("./utils/rand");

// mongodb 数据库登录
require("./common/db")

// 登录
loginDevice();

// 事件入口
events();

// 定时发送
require("./utils/setTime")
require("./utils/weekly")


// login with your password or password_md5
bot.login(config.pwd); //不输入密码则走扫码登录
