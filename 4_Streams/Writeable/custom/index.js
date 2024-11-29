import { join } from "path";
import { ToFileStream } from "./to-file-stream.js";
const tfs = new ToFileStream();

tfs.write({ path: join("otp", "file1.txt"), content: "Hello" });
tfs.write({ path: join("otp", "file2.txt"), content: "Node.js" });
tfs.write({ path: join("otp", "file3.txt"), content: "streams" });
tfs.end(() => console.log("All files created"));
