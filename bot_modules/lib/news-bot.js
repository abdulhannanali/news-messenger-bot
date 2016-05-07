const templator = require("../templates/templator")
const async = require("async")


module.exports = function (bot) {
    const news = require("../../lib/news")
    const readability = require("../../lib/readability")(process.env["READABILITY_TOKEN"], process.env["READABILITY_SECRET"])
    
        const topics = news.googleTopics
    
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
 
            var links = articles.forEach(function (article) {
                return article.simpleLink
            })
            
            async.map(links, readability.parse, function (error, parsedArticles) {
                var finalArticles = articles.map(function (article, index, array) {
                    var parsedArticle = parsedArticles[index]
                    
                    if (parsedArticle) {
                        article["lead_image_url"] = parsedArticle["lead_image_url"]
                        article["excerpt"] = parsedArticle["excerpt"]
                    }
                    
                    return article
                })
                
                var articlesMessage = templator.newsArticlesGenericTemplate(finalArticles)
                 
                reply(articlesMessage, cb)
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
   
    return {
        sendGenericNews: sendGenericNews,
        sendNotFound: sendNotFound,
        sendCategories: sendCategories,
        sendHelp: sendHelp,
        sendAbout: sendAbout
    }
}