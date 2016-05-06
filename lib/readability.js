const request = require("request")
const API_ENDPOINT = "https://readability.com/api/content/v1/"

function init (token, secret) {
    if (!token) {
        throw new Error("Token is required you bitch!")
    }
    
    function parse (url, cb) {
        var PARSER_URL = API_ENDPOINT + "parser"

        request({
            url: PARSER_URL,
            qs: {
                token: token,
                url: url
            }    
        }, function (error, response, body) {
            if (error) {
                cb(error)
            }
            else if (response.body) {
                try {
                    var parsedContent = JSON.parse(response.body) 
                    if (parsedContent) {
                        cb(error, parsedContent)
                    }   
                }
                catch (error) {
                    cb(new Error("Error occured while parsing the body of the request!"))   
                }
            }
            else {
                cb(new Error("No content receieved in the API"))
            }
        })
    }
    
    return {
        parse: parse
    }
}


module.exports = init