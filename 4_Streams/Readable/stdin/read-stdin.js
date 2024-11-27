process.stdin
	.on("readable", () => {
		let chunk;
		console.log("New data available");
		while ((chunk = process.stdin.read(10)) !== null) {
			console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString()}"`);
		}
	})
	.on("end", () => console.log("End of stream"));
