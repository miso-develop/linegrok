import ngrok, { Ngrok } from "ngrok"
import { Client } from "@line/bot-sdk"

export namespace Linegrok {
	export type Options = {
		client: Client,
		port: string | number,
		path?: string,
		authtoken?: string,
		region?: Ngrok.Region,
		interval?: number,
	}
	
	export type EndpointUrl = string
}

const Default: Omit<Linegrok.Options, "client" | "port"> = {
	path: "/",
	region: "jp",
	authtoken: undefined,
	interval: 90 * 60 * 1000,
}

export const linegrok = async ({
	client,
	port,
	path = Default.path,
	region = Default.region,
	authtoken = Default.authtoken,
	interval = Default.interval,
}): Promise<Linegrok.EndpointUrl> => {
	const options: Linegrok.Options = { client, port, path, region, authtoken, interval }
	keepAlive(options)
	return await setWebhookUrl(options)
}

const keepAlive = (options: Linegrok.Options): void => {
	if (!!options.authtoken) return
	
	setInterval(async () => {
		await ngrok.kill()
		await setWebhookUrl(options)
	}, options.interval)
}

const setWebhookUrl = async (options: Linegrok.Options): Promise<Linegrok.EndpointUrl> => {
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
		await handleError(e)
		throw e
	}
}

const handleError = async (error: Error): Promise<void> => {
	if (error.toString().includes("TypeError: Cannot read properties of undefined (reading 'body')")) {
		// MEMO: 不正なauthtokenが登録されたままだとngrokの実行が正常に行えないため、authtokenをクリアする
		await ngrok.authtoken("")
		throw new Error("Invalid authtoken!")
	}
}
