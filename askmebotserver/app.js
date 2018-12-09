const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const verification = require('./routes/verification')
const messageWebHook = require('./routes/messageWebHook')

app.use(bodyParser.json())

app.get('/', verification)
app.post('/', messageWebHook)

app.listen(4005, () => {
    console.log('AskMe Server listening on port 4005')
})