const fetch = require('node-fetch');
const { bot } = require("../events/global");
const { segment } = require("oicq");

exports.getHistoryDay = async function ({ group_id, raw_message }) {
    if (!(raw_message == "历史上的今天")) return
    var date = new Date();
    const response = await fetch(`http://v.juhe.cn/todayOnhistory/queryEvent.php?date=${date.getMonth() + 1}/${date.getDate()}&key=7172dbe8520b4e680fb61392b4e282a5`)
    const data = await response.json();
    const result = data.result.shuffle() // 打乱数组
    bot.sendGroupMsg(group_id, [
        segment.text(`历史上的今天：

        `),
        segment.text(`${result[0].date}，${result[0].title}
        
        `),
        segment.text(`${result[1].date}，${result[1].title}
        
        `),
        segment.text(`${result[2].date}，${result[2].title}
        
        `),
        segment.text(`${result[3].date}，${result[3].title}
        
        `),
        segment.text(`${result[4].date}，${result[4].title}`),
    ]);
}