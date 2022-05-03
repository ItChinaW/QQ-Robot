const MongoClient = require("mongodb").MongoClient;
const config = require("../config.json")

const url = config.mongo
let _db = null;

async function connectDb() {
    if (!_db) {
        try {
            const client = new MongoClient(url, { useUnifiedTopology: true }); //不过时
            await client.connect();
            _db = client.db("jqr");
        } catch (error) {
            throw "连接数据库失败..........." + error;
        }
    }
    return _db;
}


exports.getCollection = (collection) => {
    let _col = null;
    return async () => {
        if (!_col) {
            const db = await connectDb();
            _col = await db.collection(collection)
        }
        return _col
    }
}
