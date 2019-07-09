import { v1beta1 as textToSpeech } from "@google-cloud/text-to-speech";
import * as fsPromise from "fs-extra";

const cache: Map<string, any> = new Map();

function getCacheKey(ttsRequest: any): string {
	return JSON.stringify(ttsRequest);
}

async function writeAudioFile(name: string, content: any): Promise<void> {
	console.log("Writing file", name);
	await fsPromise.writeFile(name, content);
}

export async function synthesize(text: string): Promise<void> {
	console.log("Synthesizing", { text });

	try {
		const ttsRequest: any = {
			input: { text },
			voice: {
				languageCode: "de-DE",
				name: "de-DE-Wavenet-B"
			},
			audioConfig: {
				audioEncoding: "MP3"
				// sampleRateHertz: 8000
			}
		};

		console.log("Synthesize request", ttsRequest);

		const key: string = getCacheKey(ttsRequest);

		if (cache.has(key)) {
			console.log("Returning cached speech synthesis");
			return;
		}

		const client: textToSpeech.TextToSpeechClient = new textToSpeech.TextToSpeechClient();

		const [{ audioContent }] = await client.synthesizeSpeech(ttsRequest);

		cache.set(key, audioContent);

		await writeAudioFile(`audio.mp3`, audioContent);
	} catch (e) {
		console.error("Unable to synthesize text", e);
	}
}
