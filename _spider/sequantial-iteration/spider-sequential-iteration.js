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
		// The file already exists, let's process the links
		spiderLinks(url, fileContent, nesting, callback);
	});
};

const spiderLinks = (currentUrl, body, nesting, callback) => {
	if (nesting === 0) {
		// Sure to exit of event loop.
		return process.nextTick(callback);
	}
	const links = getPageLinks(currentUrl, body);
	if (links.length === 0) {
		return process.nextTick(callback);
	}
	function iterate(index) {
		if (index === links.length) {
			return callback();
		}
		spider(links[index], nesting - 1, function (err) {
			if (err) {
				return callback(err);
			}
			iterate(index + 1);
		});
	}
	iterate(0);
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
