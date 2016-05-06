/*
 * bot_modules/index.js
 * Provides the redirection for the bot 
 * and redirects the message to the proper place
 */

module.exports = function (bot) {
    var text = require("./text")(bot)
    var postback = require("./postback")(bot)
    
    if (!bot || ! typeof bot == "object") {
        throw new Error("Proper instance of bot not provided!")
    }
    
    bot.on("message", function (payload, reply) {
        if (payload && payload.message.text) {
            text.handleText(payload, reply)      
        }
    })
}