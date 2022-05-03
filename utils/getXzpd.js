const fetch = require('node-fetch');
const { bot } = require("../events/global");
const { segment } = require("oicq");

exports.getXzpd = async function (groupId, order) {
    let [orderName, content] = order.split(" ")
    if (orderName == "星座配对" && content) {
        let [nan, nv] = content.split("和")
        nan = encodeURI(nan);
        nv = encodeURI(nv);

        const res = await fetch(`http://apis.juhe.cn/xzpd/query?men=${nan}&women=${nv}&key=5822f837a2850365a7e70efeacd42ee9`)
        const data = await res.json();
        
        bot.sendGroupMsg(groupId, [
            segment.text(`【${data.result.men} 和 ${data.result.women}】配对结果：    
            `),
            segment.text(`${data.result.jieguo}
                        ${data.result.zhuyi}`)
        ]);
    }
    return false
}