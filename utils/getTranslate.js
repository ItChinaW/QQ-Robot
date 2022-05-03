const fetch = require('node-fetch');
var appid = '20210820000922436';
var key = 'T8HGN2TIHrGgN3BuaOp8';
var salt = (new Date).getTime();
var from = 'auto';
const { bot } = require("../events/global")

// 群聊
exports.getTranslate = async function (group_id, order) {
    const crypto = require('crypto'); //引入crypto加密模块
    const hash = crypto.createHash('md5'); //规定使用哈希算法中的MD5算法
    let [query, to] = order.split("译:")

    query = query.split("翻:")[1]
    if (!query) {
        return
    }

    hash.update(appid + query + salt + key);
    var sign = hash.digest('hex');
    
    query = encodeURI(query);
    const res = await fetch(`http://api.fanyi.baidu.com/api/trans/vip/translate?q=${query}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`)
    const data = await res.json();

    bot.sendGroupMsg(group_id, `原文：${data.trans_result[0].src} 译文：${data.trans_result[0].dst}`)
}

// 私聊
exports.getPrvTranslate = async function (user_id, order) {
    const crypto = require('crypto'); //引入crypto加密模块
    const hash = crypto.createHash('md5'); //规定使用哈希算法中的MD5算法
    let [query, to] = order.split("译:")

    query = query.split("翻:")[1]
    if (!query) {
        return
    }

    hash.update(appid + query + salt + key);
    var sign = hash.digest('hex');

    const res = await fetch(`http://api.fanyi.baidu.com/api/trans/vip/translate?q=${query}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`)
    const data = await res.json();

    bot.sendPrivateMsg(user_id, `原文：${data.trans_result[0].src} 译文：${data.trans_result[0].dst}`)
}