const async = require("async")
const wait = require("./lib/waitMessages")()

module.exports = function (bot) {
    const newsBot = require("./lib/news-bot")(bot)
    
    function handleText (payload, reply) {
        var text = processText(payload.message.text)
        if (text == "help") {
            async.series([
                (callback) => wait.waitSearchQuery(payload, reply, callback),
                (callback) => newsBot.sendHelp(payload, reply)
            ], function (error, results) {
                console.log(results)
            })
        }
        else if (text == "categories") {
            async.series([
                (callback) => wait.waitSearchQuery(payload, reply, callback),
                (callback) => reply({text: "Here are some of the major categories, we have for you!"}, callback),
                (callback) => newsBot.sendCategories(payload, reply, callback)
            ])
        }
        else if (text == "about") {
            newsBot.sendAbout(payload, reply)
        }
        else {
            async.series([
                (callback) => wait.waitSearchQuery(payload, reply, callback),
                (callback) => wait.searchResultHead(payload, reply, callback)
            ])
            newsBot.sendGenericNews(text, undefined, payload, reply, (error, articles) => {
                if (!articles || !articles[0]) {
                    newsBot.sendNotFound(payload, reply, callback)
                }
            })    
               
        }
    }
    
    /*
     * processText
     * processText processes the text to trim, lowercase and stuff
     */
    function processText (text) {
        if (text && typeof text == "string") {
            return text.toLowerCase().trim()
        } 
    }
    
    
    return {
        handleText: handleText
    }
    
}