import { ChannelDtmfReceived, playMediaFromUrl } from "./channel";

export function StasisStart(ariClient: any): any {
	console.log("Creating StasisStart handler");
	return async (event: any, incomingChannel: any) => {
		console.log("New channel ", incomingChannel.id, { event });

		await incomingChannel.answer();

		console.log("Answered a call from ", incomingChannel.caller.number);

		await playMediaFromUrl(ariClient, incomingChannel, "https://static.codedrift.net/audio/clinq.wav");

		incomingChannel.on("ChannelDtmfReceived", ChannelDtmfReceived(ariClient));

		// await incomingChannel.hangup();
	};
}
