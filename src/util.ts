import { CONFIG } from ".";

// Channel.play() wants an Object that contains the plaback URL and playback function
//  convenience function to populate this.
export const msgFormat: any = (msg: string, ariClient: any) => {
	console.log("Generating audio", { msg });
	return {
		media: `sound:${CONFIG.deepvoice.url}?text=${encodeURIComponent(msg)}`,
		playback: ariClient.Playback()
	};
};
