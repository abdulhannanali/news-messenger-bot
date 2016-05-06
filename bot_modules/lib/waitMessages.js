module.exports = function () {
    
    function waitSearchQuery (payload, reply, cb) {
        if (!reply) {
            throw new Error("`reply` function is required in this method")
        }
        
        reply({
            text: "We are processing your query right now!"
        }, cb)
    }
    
    
    function searchResultHead (payload, reply, cb) {
        reply({
            text: "Here are the results for what you asked!" 
        }, cb)
    }
    
    return {
        waitSearchQuery: waitSearchQuery,
        searchResultHead: searchResultHead
    }
} 