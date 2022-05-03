const { bot } = require("./global.js");
const { message } = require("../common/data")
const { changeNickName, setGender, setSignature, setKeyword, setGroupKick, setGroupLeave } = require("../controllers/order")
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
    bot.on("message.group", (data) => {
        let order = data.raw_message;
        if (data.user_id == config.owner) {
            setGroupKick({ orderName: order, groupId: data.group_id }) || setGroupLeave({ orderName: order }) ||
                setGender({ orderName: order }) ||
                setSignature({ orderName: order }) ||
                changeNickName({ orderName: order })
        }
        if (data.atme) {
            order = data.message[1].data.text
            getKnowleage(data.group_id, order, data.user_id)
            return
        }
        (order == "历史上的今天" && getHistoryDay(data.group_id)) ||
            ((order == "来个笑话" || order == "讲个笑话") && getJoke(data.group_id)) ||
            reply({ keyword: data.raw_message, group_id: data.group_id });
        getWeather(data.group_id, order);  // 天气
        getSxpd(data.group_id, order);    // 生肖配对
        getXzpd(data.group_id, order);     // 星座配对
        getXzys(data.group_id, order);     // 星座运势
        getCyjl(data.group_id, order);     // 成语接龙
        getTranslate(data.group_id, order) // 翻译
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
