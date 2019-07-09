import { msgFormat } from "./util";

export function ChannelDtmfReceived(ariClient: any): any {
	return (channelEvent, channel) => {
		const digit: any = channelEvent.digit;
		console.log("got digit: ", digit);
		if (digit !== "6") {
			channel
				.play(msgFormat("you pressed the digit " + digit, ariClient))
				.then(() => channel.play(msgFormat("You naughty person", ariClient)))
				.then(() => channel.play(msgFormat("Do not do that again!", ariClient)));
		} else {
			channel
				.play(msgFormat("Great you pressed " + digit, ariClient))
				.then(() => channel.play(msgFormat("That was a cool choice", ariClient)))
				.then(() => channel.play(msgFormat("Good work you win", ariClient)))
				.then(() => channel.play(msgFormat("Nice talking to you Goodbye", ariClient)))
				.then((playback, err) => playback.once("PlaybackFinished", () => channel.hangup()));
		}
	};
}
