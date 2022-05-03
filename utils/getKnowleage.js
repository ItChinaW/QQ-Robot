const fetch = require("node-fetch")
const { bot } = require("../events/global");

exports.getKnowleage = async function(group_id, order,user_id){
    let Appid = "19db1eb465328f4b8d36a011829b4a0e"
    // 把字符串编码
    order = encodeURI(order)

    let res = await fetch(`https://api.ownthink.com/bot?appid=${Appid}&userid=${user_id}&spoken=${order}`)
    let data = await res.json()

    bot.sendGroupMsg(group_id,data.data.info.text)
}