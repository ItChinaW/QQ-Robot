const keyWordConn = require("../common/db").getCollection("keyword");
const imgConn = require("../common/db").getCollection("image");

// 插入关键词
exports.context = async function (keyword, content) {
    const col = await keyWordConn();
    col.insertOne({ keyword: keyword, content: content })
}

// 查询全部关键词
exports.getKeyword = async function () {
    const col = await keyWordConn();
    const data = await col.find({}).toArray()
    return data
}

// 删除指定关键词
exports.delKeyword = async function (keyword) {
    const col = await keyWordConn();
    col.deleteOne({ keyword: keyword })
}

// 添加爆照图片
exports.addImg = async function (img) {
    const col = await imgConn();
    col.insertOne({ img: img })
}

// 获取爆照图片
exports.getImg = async function (img) {
    const col = await imgConn();
    const data = await col.find({}).toArray()
    return data
}

