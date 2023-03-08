"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linegrok = void 0;
const ngrok_1 = __importDefault(require("ngrok"));
const semver_1 = __importDefault(require("semver"));
const Default = {
    path: "/",
    region: "jp",
    authtoken: undefined,
    interval: 90 * 60 * 1000,
};
const linegrok = async ({ client, port, path = Default.path, region = Default.region, authtoken = Default.authtoken, interval = Default.interval, }) => {
    const options = { client, port, path, region, authtoken, interval };
    keepAlive(options);
    return await setWebhookUrl(options);
};
exports.linegrok = linegrok;
const keepAlive = (options) => {
    if (!!options.authtoken)
        return;
    setInterval(async () => {
        await ngrok_1.default.kill();
        await setWebhookUrl(options);
    }, options.interval);
};
const setWebhookUrl = async (options) => {
    // MEMO: ngrok実行ファイルが古いバージョンだと"jp"リージョンに対応しているか不明なため、v2.3.40未満は一律"us"リージョンにする
    const region = semver_1.default.gte(await ngrok_1.default.getVersion(), "2.3.40") ? options.region : "us";
    const ngrokOptions = {
        addr: options.port,
        region,
        authtoken: options.authtoken,
    };
    try {
        const ngrokUrl = await ngrok_1.default.connect(ngrokOptions);
        const endpointUrl = `${ngrokUrl}${options.path}`;
        await options.client.setWebhookEndpointUrl(endpointUrl);
        return endpointUrl;
    }
    catch (e) {
        await handleError(e);
        throw e;
    }
};
const handleError = async (error) => {
    if (error.toString().includes("TypeError: Cannot read properties of undefined (reading 'body')")) {
        // MEMO: 不正なauthtokenが登録されたままだとngrokの実行が正常に行えないため、authtokenをクリアする
        await ngrok_1.default.authtoken("");
        throw new Error("Invalid authtoken!");
    }
};
