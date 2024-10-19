import { EventEmitter } from "events";

class FindRegex extends EventEmitter {
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
			setTimeout(() => {
				if (!quote) {
					this.emit("error", new Error(`Couldn't find ${quote}`));
					return;
				}

				this.emit("quoteread", quote);

				const match = quote.match(this.regex);
				if (match) {
					console.log(`Quote: ${quote} matched, emitting found event`);
					this.emit("found", match);
				}
			}, 100);
		}
		return this;
	}
}

const findRegexInstance = new FindRegex(/\w+/);
findRegexInstance
	.addQuote("classA")
	.addQuote("classB")
	.find()
	.on("found", (match) => console.log(`Matched "${match}"`))
	.on("quoteread", (quote) => console.log(`${quote} was read`))
	.on("error", (err) => console.error(`Error emitted ${err.message}`));
