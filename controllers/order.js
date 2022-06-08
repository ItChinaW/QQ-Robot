const { bot } = require("../events/global");
const { context, delKeyword, addImg } = require("../server/keyword")
const { IsClocked, ToClock, ToJoinClock } = require("../server/clock")
const config = require("../config.json");
const { isEmpty } = require("lodash");

// 改变QQ名称
exports.changeNickName = function (data) {
    let [order, content] = data.orderName.split(":")
    order == "name" && bot.setNickname(content)
    if (order == "name") return false
}

// 改变QQ个性签名
exports.setSignature = function (data) {
    let [order, content] = data.orderName.split(":")
    order == "signature" && bot.setSignature(content)
    if (order == "signature") return false
}

// 改变QQ性别
exports.setGender = function (data) {
    let [order, content] = data.orderName.split(":")
    order == "gender" && bot.setGender(content)
    if (order == "gender") return false
}

// 添加关键词和内容
exports.setKeyword = async function (data) {
    let order = data.orderName;
    if (order == 'add' && data.userId == config.owner) {
        bot.sendPrivateMsg(data.userId, "请输入添加的关键词和回复内容：")
        bot.once("message.private", (data) => {
            let order = data.raw_message;
            let position = order.indexOf(" ");
            let keyword = order.slice(0, position);
            let content = order.slice(position + 1, order.length);
            // 将关键词和内容传送到数据库中
            try {
                context(keyword, content);
                bot.sendPrivateMsg(data.user_id, "添加成功");
            } catch (error) {
                console.log(error);
            }
        });
    }
    else if (order == 'delete' && data.userId == config.owner) {
        bot.sendPrivateMsg(data.userId, "请输入删除的关键词：")
        await bot.once("message.private", (data) => {
            let keyword = data.raw_message;
            // 将关键词和内容传送到数据库中
            try {
                delKeyword(keyword)
                bot.sendPrivateMsg(data.user_id, "删除成功")
            } catch (error) {
                console.log(error)
            }
        });
    }
    else if (order == '爆照' && data.userId == config.owner) {
        bot.sendPrivateMsg(data.userId, "请发送爆照图片：")
        bot.once("message.private", (data) => {
            let keyword = data.raw_message;
            keyword = keyword.split("url=")[1].split("]")[0]
            // 将关键词和内容传送到数据库中
            try {
                addImg(keyword)
                bot.sendPrivateMsg(data.user_id, "添加成功")
            } catch (error) {
                console.log(error)
            }
        });
    }
}

// 踢人
exports.setGroupKick = function (data) {
    let [order, userId] = data.orderName.split(":")
    order == "T" && bot.setGroupKick(data.groupId, userId)
    if (order == "T") {
        bot.sendGroupMsg(data.groupId, `已经将${userId}请出群聊，请注意群规范哦`);
        return false
    }
}

// 退群
exports.setGroupLeave = function (data) {
    let [order, groupId] = data.orderName.split(":")
    order == "quit" && bot.setGroupLeave(groupId)
    if (order == "quit") {
        bot.sendPrivateMsg(config.owner, `已经退出群聊：${groupId}`)
        return false
    }
}

// 打卡功能
exports.clockEntity = async function (data) {
    if (!(/(打卡)/.test(data.raw_message))) return
    // 是否参加打卡
    const result = await IsClocked(data.user_id)
    // 如果没参加
    if (isEmpty(result)) {
        await ToJoinClock(data.user_id, data.sender.nickname)
        bot.sendGroupMsg(data.group_id, "欢迎参加打卡比赛，打卡第1天，加油！！！");
        return
    }
    // ...
    const count = await ToClock(data.user_id)
    if (count === 0) {
        bot.sendGroupMsg(data.group_id, "今天已经打过卡啦");
        return
    }
    bot.sendGroupMsg(data.group_id, `打卡第${count}天，加油！！！`);
}