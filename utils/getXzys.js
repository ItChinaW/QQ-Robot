const fetch = require('node-fetch');
const { bot } = require("../events/global");
const { segment } = require("oicq");

exports.getXzys = async function (group_id, order) {
    const [orderName, content] = order.split(" ")
    if (orderName == "星座运势" && content) {
        content = encodeURI(content)
        const res = await fetch(`http://web.juhe.cn/constellation/getAll?consName=${content}&type=today&key=ff8a86e30b8efdbfd4717e5b3285a09d`)
        let data = await res.json()
        bot.sendGroupMsg(group_id, [
            segment.text(`\t\t\t\t  ☆${data.name}
        `),
            segment.text(`☆幸运颜色：${data.color}
        `),
            segment.text(`☆幸运数字：${data.number}
        `),
            segment.text(`☆速配星座：${data.QFriend}
        `),
            segment.text(`☆综合运势：${data.all}%
        `),
            segment.text(`☆${data.summary}`),
        ])
        return
    }
}