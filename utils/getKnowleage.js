const {bot} = require("../events/global");
const {AskQuestion} = require("./chatgpt");

// exports.getKnowleage = async function(group_id, order,user_id){
//     let Appid = "19db1eb465328f4b8d36a011829b4a0e"
//     // 把字符串编码
//     order = encodeURI(order)
//
//     let res = await fetch(`https://api.ownthink.com/bot?appid=${Appid}&userid=${user_id}&spoken=${order}`)
//     let data = await res.json()
//
//     bot.sendGroupMsg(group_id,data.data.info.text)
// }

exports.getKnowleage = async function (group_id, order, user_id) {
    await bot.sendGroupMsg(group_id, `${order}，正在为您查询，请稍等...`)
    const result = await AskQuestion(order)
    await bot.sendGroupMsg(group_id, result)
}
