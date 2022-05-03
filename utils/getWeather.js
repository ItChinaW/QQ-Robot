const fetch = require('node-fetch');
const { bot } = require("../events/global");
const { segment } = require("oicq");

exports.getWeather = async function (groupId, order) {
    let [orderName, city] = order.split(" ")
    city = encodeURI(city)
    if (orderName == "天气") {
        const res = await fetch(`http://apis.juhe.cn/simpleWeather/query?city=${city}&key=07f4f168d2c4980d4f8f3c98e6d2f913`)
        const data = await res.json();
        let result = data.result.future
        bot.sendGroupMsg(groupId, [
            segment.text(`【${data.result.city}】    
            `),
            segment.text(`${result[0].date + result[0].weather} 气温${result[0].temperature} ${result[0].direct}
            `),
            segment.text(`${result[1].date + result[1].weather} 气温${result[1].temperature} ${result[1].direct}
            `),
            segment.text(`${result[2].date + result[2].weather} 气温${result[2].temperature} ${result[2].direct}
            `),
            segment.text(`${result[3].date + result[3].weather} 气温${result[3].temperature} ${result[3].direct}
            `),
            segment.text(`${result[4].date + result[4].weather} 气温${result[4].temperature} ${result[4].direct}`)
        ]);
    }
    return false
}