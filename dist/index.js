"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linegrok = void 0;
const ngrok_1 = __importDefault(require("ngrok"));
const bot_sdk_1 = require("@line/bot-sdk");
const OptionDefault = {
    path: "/",
    region: "jp",
    authtoken: undefined,
};
const linegrok = async ({ channelAccessToken, port, path = OptionDefault.path, region = OptionDefault.region, authtoken = OptionDefault.authtoken, }) => {
    const ngrokOptions = {
        addr: port,
        region,
        authtoken,
    };
    try {
        const ngrokUrl = await ngrok_1.default.connect(ngrokOptions);
        const endpoint = `${ngrokUrl}${path}`;
        const client = new bot_sdk_1.messagingApi.MessagingApiClient({ channelAccessToken });
        client.setWebhookEndpoint({ endpoint });
        return endpoint;
    }
    catch (e) {
        await handleError(e);
        throw e;
    }
};
exports.linegrok = linegrok;
const handleError = async (error) => {
    if (error.toString().includes("TypeError: Cannot read properties of undefined (reading 'body')")) {
        // MEMO: 不正なauthtokenが登録されたままだとngrokの実行が正常に行えないため、authtokenをクリアする
        await ngrok_1.default.authtoken("");
        throw new Error("Invalid authtoken!");
    }
};
