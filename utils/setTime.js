const { bot } = require("../events/global");
const { cqcode } = require("oicq");

// 定时
setInterval(async () => {
    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()
    let hi;
    if (hours == 12 && minutes == 00) {
        hi = cqcode.record("./static/audio/M}4PW}QVADVOY@TSSN%9JF3.amr")
    } else if (hours == 15 && minutes == 00) {
        hi = cqcode.record("./static/audio/BROV~`Y{WUPHRY`QM8SGNZ0.amr")
    } else if (hours == 23 && minutes == 00) {
        hi = cqcode.record("./static/audio/7D[2D5A6E5EI_IU@X(8S6@7.amr")
    }
    if (hi) {
        bot.gl.forEach((info, groupId, map) => {
            bot.sendGroupMsg(groupId, hi)
        })
        hi = ""
    }
}, 60000);
