import * as client from "ari-client";
import * as base64 from "base-64";
import * as fsPromise from "fs-extra";
import { StasisStart } from "./stasis";
import { synthesize } from "./tts";

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

async function loadGcpCredentials(): Promise<void> {
	return new Promise(async (resolve, reject) => {
		console.log("Loading GCP credentials");
		const gcpCrendtialsBase64: string = process.env.GCP_CREDENTIALS;
		const gcpCrendtialsFile: string = process.env.GOOGLE_APPLICATION_CREDENTIALS;
		if (gcpCrendtialsFile) {
			console.log("Using provided GCP credentials file", gcpCrendtialsFile);
			resolve();
			return;
		}
		if (!gcpCrendtialsBase64) {
			// credentials are provided by env
			reject("No GCP credentials provided!");
			return;
		}
		console.log("GCP credentials provided as base64, writing to ./gcp.json");
		process.env.GOOGLE_APPLICATION_CREDENTIALS = "./gcp.json";
		const gcpDecoded: any = base64.decode(gcpCrendtialsBase64);
		await fsPromise.writeFile("gcp.json", gcpDecoded);
		resolve();
	});
}

async function startApp(): Promise<void> {
	console.log("Starting with config", CONFIG);

	await loadGcpCredentials();

	// synthesize("Herzlich wilkommen bei Klink! Hier können Sie nicht die Sprachqualität ihres Endgerätes überprüfen. Tschüss");

	const {
		asterisk: { username, port, password, host, application }
	} = CONFIG;

	const ariUrl: string = `http://${host}:${port}/ari`;

	const ariClient: any = await client.connect(ariUrl, username, password);

	ariClient.on("StasisStart", StasisStart(ariClient));

	ariClient.start(application);
}

startApp().catch(console.error);
