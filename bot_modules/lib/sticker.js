const async = require("async")

module.exports = function (bot) {
    if (!bot) {
        throw new Error("Required instance of bot not found!")
    }
    
    
    const likesId = [
        369239263222822,
        369239383222810,
        369239343222814
    ]
    
    function handleSticker (payload, reply, cb) {
        var stickerId = payload.message.sticker_id
        if (!stickerId) {
            throw new Error("sticker_id is missing in the payload")
        }
        
        if (likesId.some((id) => stickerId == id)) {
            reply({
                text: "(y) (y) (y)"
            })
        }
        else {
            var texts = [
                "Not sure if I understand this sticker but here are some rad emojis, I am going to get better at stickers one day though! <3 ",
                "😍 😘 😊 😉"
            ]
            
            texts = texts.map((text) => {
                return (callback) => {
                    reply({
                        text: text
                    }, callback)
                }
            })
            
            async.series(texts, cb)
        }
    }
    
    return {
        handleSticker: handleSticker
    }
}