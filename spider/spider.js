import fs from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename } from "./utils.js";

export const spider = (url, callback) => {
	const filename = urlToFilename(url);
	console.log({ url, filename });

	fs.access(filename, (err) => {
		// (1)
		if (err && err.code === "ENOENT") {
			console.log(`Downloading ${url} into ${filename}`);
			superagent.get(url).end((err, res) => {
				// (2)
				if (err) {
					callback(err);
				} else {
					mkdirp(path.dirname(filename), (err) => {
						// (3)
						if (err) {
							callback(err);
						} else {
							fs.writeFile(filename, res.text, (err) => {
								// (4)
								if (err) {
									callback(err);
								} else {
									callback(null, filename, true);
								}
							});
						}
					});
				}
			});
		} else {
			callback(null, filename, false);
		}
	});
};
