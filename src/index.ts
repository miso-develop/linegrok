import ngrok, { Ngrok } from "ngrok"
import { Client } from "@line/bot-sdk"

const Default: Omit<LinegrokOptions, "client" | "port"> = {
	path: "/",
	region: "jp",
	authtoken: undefined,
	interval: 90 * 60 * 1000,
}

export type LinegrokOptions = {
	client: Client,
	port: string | number,
	path?: string,
	authtoken?: string,
	region?: Ngrok.Region,
	interval?: number,
}

export const linegrok = async ({
	client,
	port,
	path = Default.path,
	region = Default.region,
	authtoken = Default.authtoken,
	interval = Default.interval,
}: LinegrokOptions): Promise<string> => {
	const options: LinegrokOptions = { client, port, path, region, authtoken, interval }
	keepAlive(options)
	return await setWebhookUrl(options)
}

const keepAlive = (options: LinegrokOptions): void => {
	if (!!options.authtoken) return
	
	setInterval(async () => {
		await ngrok.disconnect()
		await setWebhookUrl(options)
	}, options.interval)
}

const setWebhookUrl = async (options: LinegrokOptions): Promise<string> => {
	const ngrokOptions: Ngrok.Options = {
		addr: options.port,
		region: options.region,
		authtoken: options.authtoken,
	}
	
	try {
		const ngrokUrl = await ngrok.connect(ngrokOptions)
		const endpointUrl = `${ngrokUrl}${options.path}`
		await options.client.setWebhookEndpointUrl(endpointUrl)
		return endpointUrl
		
	} catch (e) {
		handleError(e)
		throw e
	}
}

const handleError = async (error) => {
	if (error.toString().includes("TypeError: Cannot read properties of undefined (reading 'body')")) {
		// MEMO: 不正なauthtokenが登録されたままだとngrokの実行が正常に行えないため、authtokenをクリアする
		await ngrok.authtoken("")
		throw new Error("Invalid authtoken!")
	}
}
