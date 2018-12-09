module.exports = (request, response) => {
    const hubChallenge = request.query['hub.challenge']
    const hubmode = request.query['hub.mode']
    const verifyTokenMatches = (request.query['hub.verify_token'] === 'demot36')

    if (hubmode && verifyTokenMatches){
        response.status(200).send(hubChallenge)
    }
    else{
        response.status(403).end()
    }
}