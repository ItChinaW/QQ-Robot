const fetch = require('node-fetch');
const { bot } = require("../events/global");
const { segment } = require("oicq");

exports.getSxpd = async function (groupId, order) {
    let [orderName, content] = order.split(" ")
    if (orderName == "生肖配对" && content) {
        let [nan, nv] = content.split("和")
        nan = encodeURI(nan);
        nv = encodeURI(nv);

        const res = await fetch(`http://apis.juhe.cn/sxpd/query?men=${nan}&women=${nv}&key=b4b9a22d2c586550774b79793f19a449`)
        const data = await res.json();

        bot.sendGroupMsg(groupId, [
            segment.text(`【${data.result.men} 和 ${data.result.women}】配对结果：    
            `),
            segment.text(`${data.result.data}`)
        ]);
    }
    return false
}