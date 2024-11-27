import fs from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename, getPageLinks } from "../utils.js";

export const spider = (url, nesting, callback) => {
	const filename = urlToFilename(url);

	fs.readFile(filename, "utf8", (err, fileContent) => {
		if (err) {
			if (err.code !== "ENOENT") {
				return callback(err);
			}
			// The file doesn't exist, so let's download it
			return download(url, filename, (err, requestContent) => {
				if (err) {
					return callback(err);
				}
				spiderLinks(url, requestContent, nesting, callback);
			});
		}
		// The file already exists, let's process the links. Here exists a race condition problem, because two files can be downloaded at the same time
		spiderLinks(url, fileContent, nesting, callback);
	});
};

const spiderLinks = (currentUrl, body, nesting, callback) => {
	if (nesting === 0) {
		return process.nextTick(callback);
	}

	const links = getPageLinks(currentUrl, body);
	if (links.length === 0) {
		return process.nextTick(callback);
	}

	let completed = 0;
	let hasErrors = false;
	function done(err) {
		if (err) {
			hasErrors = true;
			return callback(err);
		}
		if (++completed === links.length && !hasErrors) {
			return callback();
		}
	}
	links.forEach((link) => spider(link, nesting - 1, done));
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
