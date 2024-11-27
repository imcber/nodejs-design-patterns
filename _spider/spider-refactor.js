import fs from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename } from "./utils.js";

export const spider = (url, callback) => {
	const filename = urlToFilename(url);
	fs.access(filename, (err) => {
		if (!err || err.code !== "ENOENT") {
			return callback(null, filename, false);
		}
		download(url, filename, (err) => {
			if (err) {
				return callback(err);
			}
			callback(null, filename, true);
		});
	});
};

const saveFile = (filename, contents, callback) => {
	mkdirp(path.dirname(filename), (err) => {
		if (err) {
			return callback(err);
		}

		fs.writeFile(filename, contents, callback);
	});
};

const download = (url, filename, callback) => {
	console.log(`Downloading ${url}`);
	superagent.get(url).end((err, res) => {
		if (err) {
			return callback(err);
		}
		saveFile(filename, res.text, (err) => {
			if (err) {
				return callback(err);
			}
			console.log(`Dowloaded and saved url: ${url}`);
			callback(null, res.text);
		});
	});
};
