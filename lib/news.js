const yql = require("yql")
const request = require("request")
const qs = require("qs")
const fs = require("fs")

var googleTopics = JSON.parse(fs.readFileSync("./data/topic.json"))



function getNews (query, topic, cb) {
    if (!cb || typeof cb != "function") {
        throw new Error("Callback is required in getNews")
    }
    
    getNewsQuery(query, topic)
        .exec(function (error, response) {
            var articles = []
            
            if (error) {
                return cb(error)
            }
            
            if (response.query.count) {
                articles = Object.keys(response.query.results.item).map(function (key) {
                    var article =  response.query.results.item[key]
                    
                    if (article && article.link) {
                        var simpleLink = parseLink(article.link).url
                        article.simpleLink = simpleLink
                    }
                    
                    return article
                })
                
                return cb(error, articles)
            }
            else {
                return cb(error, articles)
            }
        })
}

function getNewsQuery (query, topic) {
   
   return new yql(`select * from rss where url="${getNewsLink(query, topic)}"`)
}

function parseLink (link) {
    return qs.parse(link.substr(link.indexOf("?")))
}


/*
 * getNewsLink
 * gets the news link for use in the yql it's a proper yql query
 */
function getNewsLink (query, topic, ned, rssOutput=true) {
    var newsEndpoint = `https://news.google.com/news/?`
    var queryObject = {
        hl: "en"
    }
    
    if (rssOutput) {
        queryObject["output"] = "rss"
    }
    
    if (ned) {
        queryObject["ned"] = ned
    }
    
    if (query && googleTopics[query]) {
        queryObject["topic"] = googleTopics[query]
    }
    else if (query) {
        queryObject["q"] = query
    }
    else if (topic) {
        queryObject["topic"] = topic
    }
    
    return newsEndpoint + qs.stringify(queryObject)
    
}

function googleNewsTopicify (topic) {
    if (topic && googleTopics[topic]) {
        return googleTopics[topic]
    }
}


module.exports = {
    getNews: getNews,
    getNewsQuery: getNewsQuery,
    getNewsLink: getNewsLink,
    googleTopics: googleTopics,
    googleNewsTopicify: googleNewsTopicify
}
