const { bot } = require("./global.js");

// 走密码登录，监听并输入滑动验证码ticket(同一设备只需验证一次)
exports.loginSlider = function () {
    bot.on("system.login.slider", () => {
        process.stdin.once("data", (input) => {
            bot.sliderLogin(input);
        });
    });
}

//走密码登录，监听设备锁验证(同一设备只需验证一次)
exports.loginDevice = function () {
    bot.on("system.login.device", () => {
        bot.logger.info("验证完成后敲击Enter继续..");
        process.stdin.once("data", () => {
            bot.login();
        });
    });
}

// 走扫码登录
exports.loginQrcode = function () {
    bot.on("system.login.qrcode", () => {
        process.stdin.once("data", () => {
            bot.login();
        });
    });
}