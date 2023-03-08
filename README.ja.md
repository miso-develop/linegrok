# linegrok

### [**English**](README.md) | **日本語**

linegrokはngrokの起動およびURL取得と、LINE Developer ConsoleへのWebhook URL更新を同時に行います。  
ngrokを認証していない場合は2時間でURLが無効となりますが（2023/3/8現在）、1時間半おきにngrok URLの再発行とWebhook URLの更新を自動で行います。  



## インストール

```sh
$ npm install linegrok
```



## 使い方

LINE BotのClientと、portを引数にわたして実行します。  
あとは自動的にngrokプロセスが立ち上がり、発行されたngrok URLをClientに紐づくチャネルのWebhook URLに設定します。  

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

例としてオウム返しBotのコードは以下のようになります。  
（環境変数にて`CHANNEL_ACCESS_TOKEN`、`CHANNEL_SECRET`を設定して実行してみてください）  

```js
const express = require("express")
const { Client, middleware } = require("@line/bot-sdk")
const { linegrok } = require("linegrok")

const port = process.env.PORT || 3000
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
}
const client = new Client(config)

linegrok({ client, port })



const app = express()
app.post("/", middleware(config), (req, res) => {
    handleEvents(req.body.events)
    res.send({ status: 200 })
})
app.listen(port, () => console.log(`Start server!`))



const handleEvents = events => {
    events.forEach(event => {
        switch (event.type) {
            case "message": client.replyMessage(event.replyToken, {
                type: "text",
                text: event.message.text,
            }); break
        }
    })
}
```


## オプション

|オプション|必須|既定値|内容|
|:--|:-:|:-:|:--|
|client|✔|-|LINE BotのClientを指定します。<br>このClientに紐づくチャネルのWebhook URLが自動更新されます。|
|port|✔|-|Botサーバーのポート番号を指定します。|
|path||"/"|Webhook URLのpathを指定します。|
|authtoken||undefined|ngrokのAuth Tokenを指定します。<br>Auth Tokenを指定した場合はURLの定期更新は行いません。|
|region||"ja"|ngrokのリージョンを指定します。|
|interval||5,400,000|ngrokを再起動する間隔をmsecで指定します。<br>既定値は1時間半です。|



## ライセンス

[**MIT**](LICENSE)
