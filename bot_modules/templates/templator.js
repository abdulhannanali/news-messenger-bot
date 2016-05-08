const fs = require("fs")
const path = require("path")
const categories = JSON.parse(fs.readFileSync("./bot_modules/botData/categories.json").toString())
const news = require("../../lib/news")

 /*
 * newsArticlesGenericTemplate
 * generate a generic news article hoverable template
 */
function newsArticlesGenericTemplate (articles) {
    var elements = articles.map(function (article) {
        return newsArticleElement(article)
    })
    
    return {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: elements
            }
        }
    }
}


/*
 * newsArticleElement
 * generate a single news article
 */
function newsArticleElement (article) {
    if (!article) {
        throw new Error("No article found!")
    }
    
    var not_found_image = "http://i.imgur.com/ZZVyknT.png"
    var not_found_url = "http://i.imgur.com/bvuKFZp.png"
    
    var buttons = [
        {
            type: "web_url",
            title: "Read this article!",
            url: article["simpleLink"] || "https://google.com/404"
        }
    ]
    
    
    if (article["category"]) {
        buttons.push(
            {
                type: "postback",
                title: "Related news!",
                payload: "GET_ARTICLE-RELATED_" + article["category"]
            }
        )
    }
    
    if (article["summary"]) {
        var summaryPayload = {
            link: article["simpleLink"] || article["link"],
            summary: article["summary"]
        }
        
        buttons.push({
            type: "postback",
            title: "Get Summary!",
            payload: "GET_SUMMARY_" + JSON.stringify(summaryPayload)
        })
    }
    
    buttons.push((() => {
        var data = {
            title: article["title"],
            guid: article["guid"],
            pubDate: article["pubDate"],
            link: article["simpleLink"],
            lead_image_url: article["lead_image_url"]
        }
        
        
        return ({
            type: "postback",
            title: "Get more info!",
            payload: "ARTICLE_INFO_" + JSON.stringify(data)
        }) 
    })())
    
    
    return {
        title: article["title"] || "no title found!",
        item_url: article["simpleLink"] || notfoudurl,
        subtitle: "Headline: " + article["title"],
        image_url: article["lead_image_url"] || not_found_image,
        buttons: buttons
    }
}

/*
 * notFoundTemplate
 * not found template``
 */
function notFoundTemplate (
    message="Sorry! No articles found! 400! 400! ERROR! :P",
    additionalButtons=[]
    ) {
        
    var buttons = [
        {
            type: "postback",
            title: "See Categories!",
            payload: "GET_CATEGORIES"
        },
        {
            type: "postback",
            title: "Ask for help!",
            payload: "GET_HELP"
        },
        {
            type: "postback",
            title: "Know more about bot!",
            payload: "GET_ABOUT"
            
        }
    ]
    
    additionalButtons.forEach(function (button) {
        buttons.push(button)
    })
    
    return {
        attachment: {
            type: "template",
            payload: {
                template_type: "button",
                text: message,
                buttons: buttons
            }
        }
    }
}

/*
 * categoriesTemplate
 * a template for the given categories
 */
function  categoriesTemplate (
    textMessage="Some of the main important categories we have!",
    additionalCategories=[]) {
  
  function categoryElementTemplate (category) {
      if (!category) {
          return
      }
      
      return {
          title: category + "!",
          subtitle: "Get the most relevant " + category + " news",
          buttons: [
              {
                  type: "postback",
                  title: "Get " + category + " news",
                  payload: "GET_CATEGORY_" + category.toUpperCase()
              },
              {
                  type: "web_url",
                  title: "On Google News!",
                  url: news.getNewsLink(category.toLowerCase(), undefined, undefined, false)
              }
          ]
          
      }
      
  }
  
  var elements = []
  
  categories.forEach(function (category, index, array) {
      if (index > 8) {
          return;
      }
      elements.push(categoryElementTemplate(category))
  })
  
  additionalCategories.forEach(function (category) {
      elements.push(categoryElementTemplate(category))
  })
  
  elements.push({
      title: "Enter the query!",
      subtitle: "Type out anything you want to know about and we bet you'll get all good stuff.",
      buttons: [
          {
              type: "postback",
              title: "Need Help!",
              payload: "GET_HELP"
          },
          {
              type: "web_url",
              title: "Visit Google News!",
              url: "https://news.google.com"
          }
      ]
      
  })
  
  return {
      attachment: {
          type: "template",
          payload: {
              template_type: "generic",
              elements: elements
          }
      }
  }
  
}

function helpTemplate (
    helpMessage = fs.readFileSync((path.resolve(__dirname, "../botData/helpMessage.txt")), "utf-8")
    ) {
    
    var helpMessages = [
        {
            text: helpMessage
        },
        {
            text: "You can also type `categories` for seeing many popular categories"
        }
    ]
    
    return helpMessages
}

function aboutTemplate (
    aboutMessage = fs.readFileSync((path.resolve(__dirname, "../botData/aboutMessage.txt")), "utf-8")
) {
    var aboutMessages = [
        {
            text: aboutMessage
        },
        {
            text: "© 2015 Google Inc. All rights reserved. Google, Google Logo, and the Google News Logo are registered trademarks of Google Inc."
        },
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Now do some stuff :)",
                    buttons: [
                        {
                            type: "web_url",
                            title: "Visit Github Repo",
                            url: "https://github.com/abdulhannanali/news-messenger-bot"
                        },
                        {
                            type: "web_url",
                            title: "Contact Hannan!",
                            url: "https://m.me/abdulhannanali"
                        }
                    ]
                }
            }
        },
        {
            attachment: {
                type: "image",
                payload: {
                    url: "http://i.imgur.com/1goRcHq.png"
                }
            }
        }
    ]
    
    console.log(aboutMessages)
    
    return aboutMessages
}

function newsInfoTemplate (newsInfo) {
    var templates = []
    var imageUrl = newsInfo["lead_image_url"]
    
    templates.push({
        text: `Information about article with Title:\n${newsInfo["title"]}\nLink: ${newsInfo["link"]}` 
    })
    
    templates.push({
        text: `Date published: ${newsInfo["pubDate"]}`
    })
    
    if (imageUrl) {
        templates.push({
            attachment: {
                type: "image",
                payload: {
                    url: imageUrl
                }
            }
        })
    }
    
    return templates
    
}

module.exports = {
    newsArticleElement: newsArticleElement,
    newsArticlesGenericTemplate: newsArticlesGenericTemplate,
    notFoundTemplate: notFoundTemplate,
    categoriesTemplate: categoriesTemplate,
    helpTemplate: helpTemplate,
    aboutTemplate: aboutTemplate,
    newsInfoTemplate: newsInfoTemplate
}