import { Ngrok } from "ngrok";
import { Client } from "@line/bot-sdk";
export declare namespace Linegrok {
    type Options = {
        client: Client;
        port: string | number;
        path?: string;
        authtoken?: string;
        region?: Ngrok.Region;
        interval?: number;
    };
    type EndpointUrl = string;
}
export declare const linegrok: ({ client, port, path, region, authtoken, interval, }: {
    client: any;
    port: any;
    path?: string | undefined;
    region?: Ngrok.Region | undefined;
    authtoken?: string | undefined;
    interval?: number | undefined;
}) => Promise<Linegrok.EndpointUrl>;
