const fetch = require('node-fetch');
const { bot } = require("../events/global");


let Key = "e2d9f53bd658e152209c8cbdb04a4c27"

let groupId

exports.getCyjl = async function (group_id, order) {
    groupId = group_id
    let [orderName, content] = order.split(" ")
    if (orderName == "成语接龙") {
        let res = await getData(content)
        handleData(res)
        bot.sendGroupMsg(group_id, `成语接龙开始 接"${res.last_word}"`)
        return
    }
}

async function handleData(res) {
    bot.once("message.group", async (data) => {
        let keyword = data.raw_message
        if (keyword == "结束") {
            bot.sendGroupMsg(groupId, `成语接龙结束`)
            return
        }
        else if (res.data.indexOf(keyword) != -1) {
            res = await getData(keyword)
            bot.sendGroupMsg(groupId, `接"${res.last_word}"`)
            handleData(res)
        }else{
            handleData(res)
        }
        
    })
}

async function getData(content) {
    content = encodeURI(content)
    let res = await fetch(`http://apis.juhe.cn/idiomJie/query?key=${Key}&wd=${content}`)
    let data = await res.json()
    return data.result
}