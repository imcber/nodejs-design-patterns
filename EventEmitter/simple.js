import { EventEmitter } from "events";

const emitter = new EventEmitter();

// Añadir listeners
emitter.on("test", () => {
	console.log("Test event received");
});

// Emitir el evento
emitter.emit("test");
