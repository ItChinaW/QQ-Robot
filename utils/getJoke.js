const fetch = require('node-fetch');
const { bot } = require("../events/global");

exports.getJoke = async function (groupId) {
    const response = await fetch(`http://v.juhe.cn/joke/content/list.php?sort=desc&page=1&pagesize=20&time=1627754795&key=3d824cfbaa1f2fcc43637e4c756404e9`)
    const data = await response.json();
    let result = data.result.data.shuffle() // 打乱数组
    console.log('result: ', result);
    bot.sendGroupMsg(groupId, `${result[0].content}`);
}