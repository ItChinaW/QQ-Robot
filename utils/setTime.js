const { bot } = require("../events/global");
const { cqcode } = require("oicq");
const moment = require("moment");

// 定时
setInterval(async () => {
    let time = moment().format("HH:mm:ss")
    if (time === "12:00:00") {
        hi = cqcode.record("./static/audio/M}4PW}QVADVOY@TSSN%9JF3.amr")
        return
    }
    if (time === "15:00:00") {
        hi = cqcode.record("./static/audio/BROV~`Y{WUPHRY`QM8SGNZ0.amr")
        return
    }
    if (time === "23:00:00") {
        hi = cqcode.record("./static/audio/7D[2D5A6E5EI_IU@X(8S6@7.amr")
    }
}, 1000);
