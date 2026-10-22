// Import the built-in "events" module from Node.js
const EventEmitter = require("events");

// Creates a new instance of an EventEmitter
// Used to broadcast and listen for events
const emitter = new EventEmitter();

// Listener
// Use .on() to set up listener, and waits for the "time" event
// When it hears "time", it catches the message data and excutes console.log
emitter.on("time", (message) => {
    console.log("Time received:", message);
});

if (require.main === module) {
    setInterval(() => {
        const currentTime = new Date().toString();
        // Event Emitter
        // Use .emit() to broadcast the "time" event to the rest of the app
        // Sends a payload of data (currentTime), which the listener picks up
        emitter.emit("time", currentTime);
    }, 5000);
}

module.exports = emitter;