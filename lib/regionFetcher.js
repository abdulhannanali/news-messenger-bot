const request = require("request")
const regionsLink = `https://support.google.com/news/answer/40237?hl=en`
const cheerio = require("cheerio")
const qs = require("qs")

function requestNewsRegions (cb) {
    request({
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
        },
        url: regionsLink
    }, function (error, response, body) {
        if (error) {
            cb(error)
        }
        else {
            if (response.body) {
                var regions = {}
                var $ = cheerio.load(response.body)
                $("tbody").find("a").each((idx, elem) => {
                    if (elem) {
                        var href = $(elem).attr("href")
                        if (href) {
                            var ned = qs.parse(href.substr(href.indexOf("?") + 1)).ned
                        }
                    }
                })
            }
        }
    })
}


module.exports = {
    requestNewsRegions: requestNewsRegions
}