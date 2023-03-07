# linegrok

### **English** | [**日本語**](README.ja.md)

linegrok performs both starting ngrok and acquiring URL, and updating the Webhook URL in LINE Developer Console at the same time.  
If you have not authenticated ngrok, the URL will become invalid after two hours (as of 2023/3/8), but linegrok will automatically regenerate the ngrok URL and update the Webhook URL every 1.5 hours.  

## Installation

```sh
$ npm install linegrok
```



## Usage

Run linegrok by passing the Client and port for the LINE Bot as arguments.  
Then the ngrok process will start automatically and the generated ngrok URL will be set as the Webhook URL for the channel associated with the Client.  

```js
const { linegrok } = require("linegrok")
const { Client, middleware } = require("@line/bot-sdk")

const port = process.env.PORT || 3000

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET,
}

const client = new Client(config)

linegrok({ client, port })

...

```



## Options

|Option|Required|Default|Description|
|:--|:-:|:-:|:--|
|client|✔|-|Specify the Client for the LINE Bot.<br>The Webhook URL for the channel associated with this Client will be automatically updated.|
|port|✔|-|Specifies the port number of the bot server.|
|path||"/"|Specifies the path of the Webhook URL.|
|authtoken||undefined|Specifies the ngrok Auth Token.<br>If an Auth Token is specified, the URL is not updated periodically.|
|region||"ja"|Specifies the region of ngrok.|
|interval||5,400,000|Specify the interval to restart ngrok in msec.<br>The default value is 1.5 hours.|



## License

[**MIT**](LICENSE)
