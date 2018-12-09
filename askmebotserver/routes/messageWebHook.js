const fbMessageHandlers = require('../handlers/FBMessageHandlers')

module.exports = (request, response) => {
    var body = request.body

    if (body.object === 'page'){
        body.entry.forEach(function(entry){
            if (entry.messaging != null){
                fbMessageHandlers(entry.messaging[0])
            }
        })
        response.status(200).end()
    }

    
}