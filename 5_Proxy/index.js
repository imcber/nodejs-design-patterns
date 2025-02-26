import { createWriteStream } from "fs";
import { createLoggingWritable } from "./logging-writable.js";

const writable = createWriteStream("out/test.txt");
const writableProxy = createLoggingWritable(writable);

writableProxy.write("First chunk");
writableProxy.write("Second chunk");
writable.write("This is not logged");
writableProxy.end();
