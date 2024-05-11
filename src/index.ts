import ngrok, { Ngrok } from "ngrok"
import { messagingApi } from "@line/bot-sdk"

export namespace Linegrok {
	export type Options = {
		channelAccessToken: string
		port: string | number
		path?: string
		authtoken?: string
		region?: Ngrok.Region
	}
	
	export type EndpointUrl = string
}

const OptionDefault: Omit<Linegrok.Options, "channelAccessToken" | "port"> = {
	path: "/",
	region: "jp",
	authtoken: undefined,
}

export const linegrok = async ({
	channelAccessToken,
	port,
	path = OptionDefault.path,
	region = OptionDefault.region,
	authtoken = OptionDefault.authtoken,
}: Linegrok.Options): Promise<Linegrok.EndpointUrl> => {
	const ngrokOptions: Ngrok.Options = {
		addr: port,
		region,
		authtoken,
	}
	
	try {
		const ngrokUrl = await ngrok.connect(ngrokOptions)
		const endpoint = `${ngrokUrl}${path}`
		
		const client = new messagingApi.MessagingApiClient({ channelAccessToken })
		client.setWebhookEndpoint({ endpoint })
		
		return endpoint
		
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
