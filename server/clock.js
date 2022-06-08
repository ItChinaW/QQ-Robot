const moment = require("moment");
const clockConn = require("../common/db").getCollection("clock");
const { isEmpty } = require("lodash");

// 参加打卡比赛
exports.ToJoinClock = async function (user_id, user_name) {
    const col = await clockConn();
    col.insertOne({ qq_id: user_id, clock_time: moment().format("YYYY/MM/DD"), clock_count: 1, clock_nickname: user_name })
}

// 查询是否打卡
exports.IsClocked = async function (user_id) {
    const col = await clockConn();
    const data = await col.findOne({ qq_id: user_id })
    return data
}

// 增加打卡次数
exports.ToClock = async function (user_id) {
    const col = await clockConn();
    const now = await col.findOne({ qq_id: user_id })
    // 限制今天重复打卡
    if (now.clock_time === moment().format("YYYY/MM/DD")) {
        return 0
    }
    // 超过一天没打卡，重置打卡
    if (now.clock_time !== moment().subtract(1, 'days').format("YYYY/MM/DD")) {
        col.update({ qq_id: user_id }, { $set: { clock_count: 1 } })
        return 1
    }
    col.update({ qq_id: user_id }, { $set: { clock_count: now.clock_count++ } })
    return now.clock_count++
}

// 打卡排行榜
exports.ClockRank = async function () {
    const col = await clockConn();
    const result = await col.find({ clock_count: { $gt: 0 } }).sort({ clock_count: -1 }).toArray()
    if (isEmpty(result)) {
        return "还没有人打卡过"
    }
    let str = ``
    result.forEach((item, index) => {
        if (index === result.length - 1) {
            str += `第${index + 1}名，${item.clock_nickname}，累计打卡${item.clock_count}天`
            return
        }

        str += `第${index + 1}名，${item.clock_nickname}，累计打卡${item.clock_count}天\n`
    })
    return str
}

// 破戒归零
exports.CancelClock = async function (user_id) {
    const col = await clockConn();
    col.updateOne({ qq_id: user_id }, { $set: { clock_count: 0 } })
}

// 定时清零超过一天没打卡
exports.IntervalClearClock = async function () {
    const col = await clockConn();
    const now = await col.find({}).toArray()
    now.forEach((item) => {
        // 超过一天没打卡，重置打卡
        if (item.clock_time !== moment().subtract(1, 'days').format("YYYY/MM/DD")) {
            CancelClock(item.user_id)
        }
    })

}