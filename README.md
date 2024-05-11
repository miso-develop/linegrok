# linegrok

### **English** | [**日本語**](README.ja.md)

linegrok performs both starting ngrok and acquiring URL, and updating the Webhook URL in LINE Developers console at the same time.  



## Installation

```sh
$ npm install linegrok
```



## Usage

Run linegrok by passing the Channel Access Token and Port for the LINE Bot as arguments.  
Then the ngrok process will start automatically and the generated ngrok URL will be set as the Webhook URL for the channel associated with the Channel Access Token.  

```js
const { linegrok } = require("linegrok")

const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN
const port = process.env.PORT

linegrok({ channelAccessToken, port })

...

```

As an example, the code for a parrot bot would be as follows.  
(Please set the CHANNEL_ACCESS_TOKEN and CHANNEL_SECRET as environment variables and try running it)  

```js
const express = require("express")
const { messagingApi, middleware } = require("@line/bot-sdk")
const { linegrok } = require("linegrok")

const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN
const channelSecret = process.env.CHANNEL_SECRET
const port = process.env.PORT

linegrok({ channelAccessToken, port })

const client = new messagingApi.MessagingApiClient({ channelAccessToken })



const app = express()
app.post("/", middleware({ channelSecret }), (req, res) => {
    handleEvents(req.body.events)
    res.send({ status: 200 })
})
app.listen(port, () => console.log(`Start server!`))



const handleEvents = events => {
    events.forEach(event => {
        switch (event.type) {
            case "message": client.replyMessage({
                replyToken: event.replyToken,
                messages: [{
                    type: "text",
                    text: event.message.text,
                }]
            }); break
        }
    })
}
```



## Options

|Option|Required|Default|Description|
|:--|:-:|:-:|:--|
|channelAccessToken|✔|-|Specify the Channel Access Token for the LINE Bot.<br>The Webhook URL for the channel associated with this Channel Access Token will be automatically updated.|
|port|✔|-|Specifies the port number of the bot server.|
|path||"/"|Specifies the path of the Webhook URL.|
|authtoken||undefined|Specifies the ngrok Auth Token.|
|region||"ja"|Specifies the region of ngrok.|



## License

[**MIT**](LICENSE)
