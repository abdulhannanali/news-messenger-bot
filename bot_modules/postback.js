module.exports = function (bot) {
    var newsBot = require("./lib/news-bot")(bot)


    bot.on("postback", function (data, reply) {
        var postback = data.postback.payload
        if (!(postback && typeof postback == "string" && postback.trim())) {
            return
        }  
        
        var splitParams = postback.split("_")
        var match;
        if (postback.match(/GET_CATEGORIES/i)) {
            newsBot.sendCategories(data, reply)
        }
        else if (match = postback.match(/GET_CATEGORY_(.*)/i)) {
            newsBot.sendGenericNews(undefined, splitParams[2].toLowerCase(), data, reply)
        }
        else if (postback.match(/GET_HELP/i)) {
            newsBot.sendHelp(data, reply)
        }
        else if (postback.match(/GET_ABOUT/i)) {
            newsBot.sendAbout(data, reply)
        }
        else if (match = postback.match(/GET_ARTICLE-RELATED_(.*)/g)) {
            if (match && match[1] && match[1] != "undefined") {
                newsBot.sendGenericNews(match[1], undefined, data, reply)    
            }
        }
        else if (match = postback.match(/ARTICLE_INFO_(.*)/i)) {
            if (match[1]) {
                var newsInfo = JSON.parse(match[1])
                newsBot.sendNewsInfo(newsInfo, data, reply, console.log)
            }
        }
        // else if (match = postback.match(/ARTICLES_/i)) {}
    })
}