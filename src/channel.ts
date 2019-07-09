
export async function playMediaFromUrl(ariClient: any, channel: any, url: string): Promise<void> {
	console.log("Playing media in channel", channel.id, { media: url });
	try {
		await channel.play({
			media: `sound:${url}`
		}, ariClient.Playback());
		console.log("Done playing media");
	} catch(e) {
		console.error("Cannot play media", e);
	}
}

export function ChannelDtmfReceived(ariClient: any): any {
	return (channelEvent, channel) => {
		const digit: any = channelEvent.digit;
		console.log("got dtmf event: ", {digit, channelId: channel.id});
	};
}
