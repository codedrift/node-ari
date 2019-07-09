import * as client from "ari-client";
import { StasisStart } from "./stasis";

export const CONFIG: any = {
	asterisk: {
		host: process.env.ASTERISK_IP,
		port: 8080, // ari port
		application: "myApp", // app name configured in the asterisk
		username: process.env.ASTERISK_USER,
		password: process.env.ASTERISK_PASSWORD
	},
	deepvoice: {
		url: "http://deepvoice:9000/synthesize"
	}
};

async function startApp(): Promise<void> {
	console.log("Starting with config", CONFIG);
	const {
		asterisk: { username, port, password, host, application }
	} = CONFIG;

	const ariUrl: string = `http://${host}:${port}/ari`;

	const ariClient: any = await client.connect(ariUrl, username, password);

	ariClient.on("StasisStart", StasisStart(ariClient));

	ariClient.start(application);
}

startApp().catch(console.error);
