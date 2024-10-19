import { EventEmitter } from "events";

class FindRegexSync extends EventEmitter {
	constructor(regex) {
		super();
		this.regex = regex;
		this.quotes = [];
	}
	addQuote(quote) {
		this.quotes.push(quote);
		return this;
	}
	find() {
		for (const quote of this.quotes) {
			if (!quote) {
				this.emit("error", new Error(`Couldn't find ${quote}`));
				continue;
			}

			this.emit("quoteread", quote);

			const match = quote.match(this.regex);
			if (match) {
				console.log(`Quote: ${quote} matched, emitting found event`);
				this.emit("found", match);
			}
		}
		return this;
	}
}

const findRegexSyncInstance = new FindRegexSync(/\w+/);
findRegexSyncInstance
	.addQuote("fileA")
	.addQuote("fileB")
	// this listener is invoked
	.on("found", (match) => console.log(`[Before] Matched "${match}"`))
	.find()
	// this listener is never invoked
	.on("found", (match) => console.log(`[After] Matched "${match}"`));
