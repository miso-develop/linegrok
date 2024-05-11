# linegrok

### [**English**](README.md) | **日本語**

linegrokはngrokの起動およびURL取得と、LINE DevelopersコンソールへのWebhook URL更新を同時に行います。  



## インストール

```sh
$ npm install linegrok
```



## 使い方

LINE BotのChannel Access Tokenと、Portを引数にわたして実行します。  
あとは自動的にngrokプロセスが立ち上がり、発行されたngrok URLをBotのChannel Access Tokenに紐づくチャネルのWebhook URLに設定します。  

```js
const { linegrok } = require("linegrok")

const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN
const port = process.env.PORT

linegrok({ channelAccessToken, port })

...

```

例としてオウム返しBotのコードは以下のようになります。  
（環境変数にて`CHANNEL_ACCESS_TOKEN`、`CHANNEL_SECRET`を設定して実行してみてください）  

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



## オプション

|オプション|必須|既定値|内容|
|:--|:-:|:-:|:--|
|channelAccessToken|✔|-|LINE BotのChannel Access Tokenを指定します。<br>このChannel Access Tokenに紐づくチャネルのWebhook URLが自動更新されます。|
|port|✔|-|Botサーバーのポート番号を指定します。|
|path||"/"|Webhook URLのpathを指定します。|
|authtoken||undefined|ngrokのAuth Tokenを指定します。|
|region||"ja"|ngrokのリージョンを指定します。|



## ライセンス

[**MIT**](LICENSE)
