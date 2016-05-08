const async = require("async")
const wait = require("./lib/waitMessages")()
const welcome = require("./lib/welcomeStuff")()
// const replyHandler = require("./lib/replyHandler.js")(process.env["NODE_ENV"])

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
            async.series([
              (callback) => reply({text: "Here is about information!"}, callback),  
              (callback) => newsBot.sendAbout(payload, reply, callback)  
            ])
        }
        else if (text == "info") {
            async.series([
                (callback) => reply({text: "Information we have about you"}, callback),
                (callback) => {
                    bot.getProfile(payload.sender.id, (error, profile) => {
                        if (error) {
                            return callback(error)
                        }
                        else {
                            async.parallel([
                                (callback) => reply({text: "First Name: " + profile.first_name}, callback),
                                (callback) => reply({text: "Last Name: " + profile.last_name}, callback),
                                (callback) => reply({attachment: {type:"image", payload: {url: profile.profile_pic}}}, callback)
                            ])
                        }
                    })
                }
            ])
        }
        else if (text == "welcome_message") {
            welcome.sendWelcomeMessage(bot, payload, reply)
        }
        else {
            async.series([
                (callback) => wait.waitSearchQuery(payload, reply, callback),
                (callback) => newsBot.sendGenericNews(text, undefined, payload, reply, callback)  
            ])    
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