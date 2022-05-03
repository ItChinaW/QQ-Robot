const { bot } = require("../events/global");
const { reply } = require("../common/data")
const getImg = require("../server/keyword").getImg()
require("../utils/rand")

// 监听关键词回复
exports.reply = async function (data) {
    const getData = require("../server/keyword").getKeyword()
    // 获取异步数据，异步数据只能异步函数中获取
    let arr = await getData
    let arrImg = await getImg
    // 其它
    if (/生肖配对|星座配对/.test(data.keyword) && data.keyword.length == 4) {
        bot.sendGroupMsg(data.group_id, "配对命令：xx配对 xx（男）和xx（女），例如：星座配对 白羊和狮子");
        return
    }
    else if (/爆照/.test(data.keyword)) {
        setTimeout(async () => {
            if (arrImg.length == 0) {
                getImg = require("../server/keyword").getImg()
                arrImg = await getImg
            } else {
                bot.sendGroupMsg(data.group_id, reply(arrImg[arrImg.length - 1].img));
                arrImg = arrImg.splice(arrImg.length - 1, 1)
            }
        }, 1500)
        return
    }
    else if (/语种大全/g.test(data.keyword)) {
        bot.sendGroupMsg(data.group_id, reply("https://c2cpicdw.qpic.cn/offpic_new/13245505//13245505-219571708-05457C2A7089B084E94E29A74EBEA9C9/0?term=3"));
        return
    }
    // 循坏遍历与正则匹配
    for (let i = 0; i < arr.length; i++) {
        if (data.keyword.includes(arr[i].keyword)) {
            bot.sendGroupMsg(data.group_id, arr[i].content);
            return
        }
    }
    return false
}