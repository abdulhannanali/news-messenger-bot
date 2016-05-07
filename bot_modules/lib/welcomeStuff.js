const async = require("async")
const colors = require("colors")

module.exports = function () {
    
    function sendWelcomeMessage (bot, payload, reply, callback) {
        if (!bot || !reply) {
            throw new Error("We can't possible send you the message in any way")
        }
        
        var templatesFuns = welcomeTemplateGenerator().map(function (template) {
            return function (callback) {
                reply(template, callback)
            }
        })
        
        async.series(templatesFuns, function (error, results) {
            if (error) {
                return console.error(error)
            }
            else {
                return console.log("Just welcomed a user!" .rainbow)
            }
        })
        
    }
    
    function welcomeTemplateGenerator () {
        var templates = []
        
        templates.push({
            text: "Hey there! Let's get talking! Type anything you want news about for the latest news regarding the topic! You'll get the same results as news.google.com"
        })
        
        templates.push({
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "In order to get the best possible results, you can also do some of the stuff described below.",
                    buttons: [
                        {
                            type: "postback",
                            title: "See news categories!",
                            payload: "GET_CATEGORIES"
                        },
                        {
                            type: "postback",
                            title: "Some more help, maybe?",
                            payload: "GET_HELP"
                        },
                        {
                            type: "postback",
                            title: "about this BOT?",
                            payload: "GET_ABOUT"
                        }
                    ]
                    
                }
            }
        })
        
        return templates

    }
    
    return {
        sendWelcomeMessage: sendWelcomeMessage,
        welcomeTemplateGenerator: welcomeTemplateGenerator
    }
}