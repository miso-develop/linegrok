import { Ngrok } from "ngrok";
export declare namespace Linegrok {
    type Options = {
        channelAccessToken: string;
        port: string | number;
        path?: string;
        authtoken?: string;
        region?: Ngrok.Region;
    };
    type EndpointUrl = string;
}
export declare const linegrok: ({ channelAccessToken, port, path, region, authtoken, }: Linegrok.Options) => Promise<Linegrok.EndpointUrl>;
