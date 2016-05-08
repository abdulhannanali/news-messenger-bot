const templator = require("../templates/templator")
const async = require("async")
const news = require("../../lib/news")
const resolver = require("../../lib/image-resolver") 
const topics = news.googleTopics
    
module.exports = function (bot) {
    function sendGenericNews (query, topic, payload, reply, cb) {
        if (cb) {
            cb = (() => {})    
        }
        
        if (query && !topic) {
            var topic = Object.keys(topics).find((topic) => query == topic)
        }
        
        news.getNews(query, topic, function (error, articles) {
            if (error) {
                return cb(error)
            }
            else if (!articles || !articles[0]) {
                return sendNotFound(payload, reply)
            }
 
            var links = articles.map(function (article) {
                return article.simpleLink
            })
            
            resolver.resolveUrls(links, function (error, images) {
                if (!error && images) {
                   
                    articles = articles.map(function (article, index) {
                        var imageData = images[index]
                        if (article && imageData) {
                            article["lead_image_url"] = imageData["image"]
                        }
                        
                        return article
                    })
                    
                }
                
                var articlesTemplate = templator.newsArticlesGenericTemplate(articles)
                
                reply(articlesTemplate, console.log)
            })
        })
    }
    
    
    // Articles not found!
    function sendNotFound (payload, reply, cb) {
        reply(templator.notFoundTemplate(), cb)
    }
    
    function sendCategories (payload, reply, cb) {
        reply(templator.categoriesTemplate(), cb)
    }
   
    function sendHelp (payload, reply, cb) {
        templator.helpTemplate().forEach(function (msg) {
            reply(msg, cb)
        })
    }
    
    function sendAbout (payload, reply, cb) {
        async.map(templator.aboutTemplate(), reply, console.log)
    }
    
    function sendNewsInfo (newsInfo, payload, reply, cb) {
        if (!newsInfo) {
            throw new Error("No info provided to send back to the user!")    
        }   
        
        var messageCalls = templator.newsInfoTemplate(newsInfo).map(function (template, index, array) {
            return (callback) => {
                reply(template, callback)
            }
        })
        
        async.series(messageCalls, cb)
        
    }
   
    return {
        sendGenericNews: sendGenericNews,
        sendNotFound: sendNotFound,
        sendCategories: sendCategories,
        sendHelp: sendHelp,
        sendAbout: sendAbout,
        sendNewsInfo: sendNewsInfo
    }
}