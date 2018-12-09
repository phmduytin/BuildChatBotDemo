const FACEBOOK_ACCESS_TOKEN = 'EAAD6QhX1VvwBAFmK8ZBcwqUrmX03nTmjKB9uzjMMazBSFYYkJbThjgelZCNdo1nG9Rg44e4h19ECIX1LIVbs5fod9MgZCNEqDbaQqhJcVWTaNtHJWpTpRWqYP5aHFza2g91oShKJoMJXEvYXvBZB64nRR1AjSUFD5zgsyXxRhJLu7ZCffuYnH'
const RestClient = require('node-rest-client').Client
const request = require('request')

const sendTextMessage = (sendID, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token : FACEBOOK_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: sendID},
            message: text
        }
    })
}

module.exports = (event) => {
    const sendID = event.sender.id
    const fbUserMessage = event.message.text

    console.log('Sender ID: ' + sendID)
    console.log('Message: ' + fbUserMessage)
    
    var senderName = ''
    getSenderInformation((senderInfo) => {
        senderName = senderInfo
    })

    getWitAPIData((witData) => {
        if (witData.entities.greet){
            sendTextMessage(sendID, {"text": "Chào " + senderName + ", tôi có thể giúp gì cho bạn!!"})
        }

        if (witData.entities.stand_ouput){
            if (witData.entities.no_understand){
                sendTextMessage(sendID, {"text": "Bạn muốn xem chuẩn đầu ra của khóa liên thông nào vậy?"})
            }
            else{
                switch(witData.entities.khoa_hoc[0].value){
                    case "LT2":
                    case "D5": 
                        sendTextMessage(sendID, {"text": "Chuẩn đầu ra liên thông 02 - D5!!"})
                        break;
                    case "LT3":
                        sendTextMessage(sendID, {"text": "Chuẩn đầu ra liên thông 03!"})
                        break;
        
                }
            }
            
        }
    })

    function getWitAPIData(callback){
        var client = new RestClient()
        var arguments = {
            data: { userMessage: fbUserMessage},
            headers: {"Content-Type": "application/json"}
        }

        client.post("http://localhost:4000/v1/getEntitiesInfo", arguments, function(data, response){
            if (data.isSuccess == true){
                callback(data.data)
            }
            else{
                callback(null)
            }
        })
    }

    function getSenderInformation(callback){
        request({
            url: "https://graph.facebook.com/v2.6/" + event.sender.id,
            qs: {
                access_token: FACEBOOK_ACCESS_TOKEN,
                fields: 'first_name'
            },
            method: 'GET'
        }, function(error, response, body){
            if (!error){
                var bodyObject = JSON.parse(body)
                callback(bodyObject.first_name)
            }
        })
    }
}