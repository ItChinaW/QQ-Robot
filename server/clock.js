const moment = require("moment");
const clockConn = require("../common/db").getCollection("clock");

// 参加打卡比赛
exports.ToJoinClock = async function (user_id) {
    const col = await clockConn();
    col.insertOne({ qq_id: user_id, clock_time: moment().format("YYYY/MM/DD"), clock_count: 1 })
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