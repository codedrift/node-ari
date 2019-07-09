import { ChannelDtmfReceived } from "./channel";
import { msgFormat } from "./util";

export function StasisStart(ariClient: any): any {
	console.log("Creating StasisStart handler");
	return async (event: any, incomingChannel: any) => {
		console.log("New channel ", incomingChannel.id, { event,  });

		await incomingChannel.answer();

		console.log("Answered a call from ", incomingChannel.caller.number);

		await incomingChannel.play(msgFormat(`Hello ${incomingChannel.caller.number.split("").join(" ")}`, ariClient));
		await incomingChannel.play(msgFormat("Welcome to our application", ariClient));
		await incomingChannel.play(msgFormat("Type some digits and see what happens", ariClient));

		incomingChannel.on("ChannelDtmfReceived", ChannelDtmfReceived(ariClient));
	};
}
