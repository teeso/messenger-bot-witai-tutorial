'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

var FB = require('./facebook');
var Config = require('./config')

// LETS MAKE A SERVER!
var app = express()
app.set('port', (process.env.PORT) || 5000)
// SPIN UP SERVER
app.listen(app.get('port'), function () {
  console.log('Running on port', app.get('port'))
})
// PARSE THE BODY
app.use(bodyParser.json())


// index page
app.get('/', function (req, res) {
  res.send('hello world i am a chat bot')
})

// for facebook to verify
app.get('/webhooks', function (req, res) {
  if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

// to send messages to facebook
app.post('/webhooks', function (req, res) {
  var entry = FB.getMessageEntry(req.body)
  // IS THE ENTRY A VALID MESSAGE?
  if (entry && entry.message) {
    // GET THE SENDER
    var sender = entry.sender.id
    console.log("Sender", sender)

    // GET THE CONTENT
    var msg = entry.message.text
    console.log("Message", msg)

    // GET THE ATTACHMENT
    var att = entry.message.attachments
    console.log("Attachment", att)

    // ECHO MESSAGE BACK
    if (msg) {
      FB.newMessage(
        sender,
        msg
      )
    }
  }

  res.sendStatus(200)
})