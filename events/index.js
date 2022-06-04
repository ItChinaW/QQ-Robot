const { bot } = require("./global.js");
const { message } = require("../common/data")
const { changeNickName, setGender, setSignature, setKeyword, setGroupKick, setGroupLeave, clockEntity } = require("../controllers/order")
const { reply } = require("../controllers/index")
const { getHistoryDay } = require("../utils/getHistory")
const { getWeather } = require("../utils/getWeather")
const { getXzpd } = require("../utils/getXzpd")
const { getSxpd } = require("../utils/getSxpd")
const { getJoke } = require("../utils/getJoke")
const { getTranslate, getPrvTranslate } = require("../utils/getTranslate");
const { getXzys } = require("../utils/getXzys.js");
const { getKnowleage } = require("../utils/getKnowleage.js");
const { getCyjl } = require("../utils/getCyjl.js");
const config = require("../config.json")

module.exports = function () {
    //自动同意好友申请
    bot.on("request.friend.add", (data) => {
        bot.setFriendAddRequest(data.flag, true);
    });

    //自动同意群邀请
    bot.on("request.group.invite", (data) => {
        data.user_id == config.owner && bot.setGroupAddRequest(data.flag, true);
    });

    //监听私聊
    bot.on("message.private", (data) => {
        let order = data.raw_message;
        if (data.user_id == config.owner) {
            changeNickName({ orderName: order }) ||
                setGender({ orderName: order }) ||
                setSignature({ orderName: order });
            setKeyword({ orderName: order, userId: data.user_id })
        }
        getPrvTranslate(data.user_id, order) // 翻译
    });

    // 监听群聊
    bot.on("message.group", async (data) => {
        let order = data.raw_message;
        if (data.user_id == config.owner) {
            if (setGroupKick({ orderName: order, groupId: data.group_id }) || setGroupLeave({ orderName: order }) ||
                setGender({ orderName: order }) ||
                setSignature({ orderName: order }) ||
                changeNickName({ orderName: order })) {
                return
            }
        }
        if (data.atme) {
            order = data.message[1].data.text
            getKnowleage(data.group_id, order, data.user_id)
            return
        }
        if (
            // 历史上的今天
            (await getHistoryDay(data)) ||
            // 笑话
            await getJoke(data) ||
            // 监听批量关键词
            await reply({ keyword: data.raw_message, group_id: data.group_id }) ||
            // 打卡
            await clockEntity(data)) {
            return
        }
        if (!(await getWeather(data.group_id, order))) return  // 天气
        if (!(await getSxpd(data.group_id, order))) return // 生肖配对
        if (!(await getXzpd(data.group_id, order))) return // 星座配对
        if (!(await getXzys(data.group_id, order))) return // 星座运势
        if (!(await getCyjl(data.group_id, order))) return // 成语接龙
        if (!(await getTranslate(data.group_id, order))) return //  翻译
    });

    //监听群员入群事件
    bot.on("notice.group.increase", (data) => {
        bot.sendGroupMsg(data.group_id, message({ nickname: data.nickname, userId: data.user_id }));
    });

    // 监听戳一戳事件
    bot.on("notice.group.poke", (data) => {
        data.self_id == data.user_id && bot.sendGroupPoke(data.group_id, data.operator_id)
    });
}
