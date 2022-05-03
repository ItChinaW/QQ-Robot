const { segment } = require("oicq");

exports.message = function (data) {
    return [
        segment.at(data.userId),
        segment.image("https://gchat.qpic.cn/gchatpic_new/13245505/936935641-2842124220-54FD740595F1ADD8E4B70908645110BA/0?term=3"),
        segment.text(`${data.nickname}，欢迎新进来的宝宝`),
    ];
}

exports.reply = function (img) {
    return [
        segment.image(img),
    ]
}