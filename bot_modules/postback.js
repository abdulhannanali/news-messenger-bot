module.exports = function (bot) {
    var newsBot = require("./lib/news-bot")(bot)


    bot.on("postback", function (data, reply) {
        var postback = data.postback.payload
        console.log(postback)
        if (!(postback && typeof postback == "string" && postback.trim())) {
            return
        }  
        
        var splitParams = postback.split("_")
        var match;
        if (postback.match(/GET_CATEGORIES/ig)) {
            newsBot.sendCategories(data, reply)
        }
        else if (match = postback.match(/GET_CATEGORY_(.*)/ig)) {
            newsBot.sendGenericNews(undefined, splitParams[2].toLowerCase(), data, reply)
        }
        else if (postback.match(/GET_HELP/ig)) {
            newsBot.sendHelp(data, reply)
        }
        else if (postback.match(/GET_ABOUT/ig)) {
            newsBot.sendAbout(data, reply)
        }
        else if (match = postback.match(/GET_ARTICLE-RELATED_(.*)/)) {
            if (match && match[1] && match[1] != "undefined") {
                newsBot.sendGenericNews(match[1], undefined, data, reply)    
            }
        }
        // else if (match = postback.match(/ARTICLES_/ig)) {}
    })
}