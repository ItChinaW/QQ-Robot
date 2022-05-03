const https = require("https")
const cheerio = require("cheerio")
const { marked } = require("marked")
const { bot } = require("../events/global");

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
        let html = ``, articleCotent = `技术资讯\n`
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
                articleCotent += `${title}\n${href}\n`
            })
            bot.gl.forEach((info, groupId, map) => {
                bot.sendGroupMsg(groupId, articleCotent)
            })
        })
    })
}

setInterval(() => getTechWeeklyLatest(), 1000 * 60 * 60 * 24)