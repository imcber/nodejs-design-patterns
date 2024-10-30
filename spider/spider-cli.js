import { spider } from "./spider-refactor.js";

spider(process.argv[2], (err, filename, downloaded) => {
	if (err) {
		console.error(`Error downloading ${process.argv[2]}:`, err);
	} else if (downloaded) {
		console.log(`Complete download of ${filename}`);
	} else {
		console.log(`Already downloaded ${filename}`);
	}
});
