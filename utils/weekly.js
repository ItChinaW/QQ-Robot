const https = require("https")
const cheerio = require("cheerio")
const { marked } = require("marked")
const moment = require("moment");
const { bot } = require("../events/global");
const { ClockRank } = require("../server/clock")

const articles = new Map()
const ISSUES = "https://juejin.cn/user/3491704662669469/posts"

const getTechWeeklyLatest = () => {
    https.get(ISSUES, (res) => {
        let html = ``
        res.on("data", (chunk) => {
            html += chunk
        })
        res.on('end', () => {
            const $ = cheerio.load(html)
            const id = $('.item').children(".entry").first().attr("data-entry-id")
            if (articles.has(id)) return
            else {
                articles.set(id, true)
                getTechWeekly(id)
            }
        })
    })
}
const getTechWeekly = (id) => {
    https.get(`https://juejin.cn/post/${id}`, (res) => {
        let html = ``, articleContent = `技术资讯\n`
        res.on('data', (chunk) => {
            html += chunk
        })
        res.on('end', () => {
            html = html.split("mark_content:")[1]
            html = html.split(",display_count")[0]
            html = marked.parse(html);
            html = html.split("## 技术资讯")[1]
            html = html.split("下面我们来看技术资料")[0]
            const $ = cheerio.load(html)
            const hrefs = $('a').toArray()
            hrefs.forEach((item) => {
                const title = $(item).text()
                const href = JSON.parse(`"${decodeURI($(item).attr("href"))}"`);
                articleContent += `${title}\n${href}\n`
            })
            bot.gl.forEach((info, groupId, map) => {
                bot.sendGroupMsg(groupId, articleContent)
            })
        })
    })
}

setInterval(() => getTechWeeklyLatest(), 1000 * 60 * 60 * 24)
setInterval(() => {
    if (moment().format("HH:mm:ss") === "08:00:00") {
        bot.gl.forEach((info, groupId, map) => {
            bot.sendGroupMsg(groupId, "早上好，美好的一天开始了，今天记得打卡哦")
        })
        return
    }
    if (moment().format("HH:mm:ss") === "00:00:00" && moment().weekday() === 1) {
        bot.gl.forEach(async (info, groupId, map) => {
            bot.sendGroupMsg(groupId, `本周打卡排行榜：\n${await ClockRank()}`)
        })
        return
    }
}, 1000)
