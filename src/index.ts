import * as client from "ari-client";

const CONFIG: any = {
	asterisk: {
		host: "35.246.120.198",
		port: 8080,
		application: "myApp",
		username: "asterisk",
		password: "asterisk"
	},
	deepvoice: {
		url: "http://192.168.1.203:9000/synthesize"
	}
};

async function startApp(): Promise<void> {
	console.log("Starting with config", CONFIG);
	const url: string = `http://${CONFIG.asterisk.host}:${CONFIG.asterisk.port}/ari`;

	// Channel.play() wants an Object that contains the plaback URL and playback function
	//  convenience function to populate this.
	const msgFormat: any = (msg, ariInstance) => ({
		media: `sound:${CONFIG.deepvoice.url}?text=${encodeURIComponent(msg)}`,
		playback: ariInstance.Playback()
	});

	const ari: any = await client.connect(url, CONFIG.asterisk.username, CONFIG.asterisk.password);

	ari.on("StasisStart", (event, incomingChannel) => {
		console.log("New channel ", incomingChannel.id);
		incomingChannel.answer().then(() => {
			console.log("Answered a call from ", incomingChannel.caller.number);
			incomingChannel
				.play(msgFormat(`Hello ${incomingChannel.caller.number.split("").join(" ")}`, ari))
				.then(() => incomingChannel.play(msgFormat("Welcome to our application", ari)))
				.then(() => incomingChannel.play(msgFormat("Type some digits and see what happens", ari)));
		});
		incomingChannel.on("ChannelDtmfReceived", (channelEvent, channel) => {
			const digit: any = channelEvent.digit;
			console.log("got digit: ", digit);
			if (digit !== "6") {
				channel
					.play(msgFormat("you pressed the digit " + digit, ari))
					.then(() => channel.play(msgFormat("You naughty person", ari)))
					.then(() => channel.play(msgFormat("Do not do that again!", ari)));
			} else {
				channel
					.play(msgFormat("Great you pressed " + digit, ari))
					.then(() => channel.play(msgFormat("That was a cool choice", ari)))
					.then(() => channel.play(msgFormat("Good work you win", ari)))
					.then(() => channel.play(msgFormat("Nice talking to you Goodbye", ari)))
					.then((playback, err) => playback.once("PlaybackFinished", () => channel.hangup()));
			}
		});
	});
	ari.start(CONFIG.asterisk.application);
}

startApp().catch(console.error);
