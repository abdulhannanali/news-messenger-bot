const colors = require("colors")

module.exports = function (mode) {
    switch (mode) {
        case "development":
            return developmentHandler
        default:
            return defaultHandler
    }
}

/*
 * developmentHandler
 * development reply handler for the messages
 */
function developmentHandler (error, success, callback) 
{
    callback(error, success)
    if (error) {
        console.log("ERROR OCCURED WHILE SENDING MESSAGE" .red)
        console.log("Error payload:" .red)
        console.log(error)
        console.log("===== END OF PAYLOAD ======" .red)
    }
    else if (success) {
        success.forEach(function (msg) {
            console.log("MESSAGE SENT SUCCESSFULLY" .green)
            console.log("MESSAGE ID: " + msg.message_id)
            console.log("RECIPIENT ID: " + msg.recipient_id)
            console.log("=========" .green)
        })
    }
}

/*
 * defaultHandler
 * defaultHandler for the replies 
 * gives the bare information about the reply status
 */
function defaultHandler (error, success, callback) {
    callback(error, success)
    if (error) {
        console.log("ERROR OCCURED IN MESSAGE" .red)
    }
    else if (success) {
        successMsg.forEach(function (msg) {
            console.log("MESSAGE WITH ID " + msg.message_id + " HAS BEEN SENT SUCCESSFULLY." .pink)        
        })
    }
}

