import { EventEmitter } from "events";

function findRegex(quotes, regex) {
	const emitter = new EventEmitter();

	for (const quote of quotes) {
		if (!quote) {
			emitter.emit("error", new Error(`Couldn't find ${quote}`));
			continue;
		}

		emitter.emit("quoteread", quote);

		const match = quote.match(regex);
		if (match) {
			console.log(`Quote: ${quote} matched ${match}, emitting found event`);
			emitter.emit("found", match);
		}
	}
	return emitter;
}

findRegex(["textA", "textB"], /\w+/g)
	.on("quoteread", (quote) => console.log(`${quote} was read`))
	.on("found", (match) => console.log(`Matched "${match}" in ${quote}`))
	.on("error", (err) => console.error(`Error emitted ${err.message}`));
