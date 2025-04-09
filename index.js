const http = require("http");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");

const app = express();

app.use(morgan("dev"));
app.use(cors());

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: (origin, callback) => {
            const allowedOrigins = ["http://localhost:3000", "http://localhost:8000", "http://localhost:8081"];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("No permitido por CORS"));
            }
        },
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("start", () => {
        io.emit("start_recording");
    });

    socket.on("pausa", () => {
        io.emit("pausar_recording");
    });

    socket.on("continua", () => {
        io.emit("continuar_recording");
    });

    socket.on("stop", () => {
        io.emit("stop_recording");
    });

    socket.on("upload", (data) => {
        io.emit("upload_recording", data);
    });

    socket.on("started", () => {
        io.emit("started_record");
    });

    socket.on("paused", () => {
        io.emit("paused_record");
    });

    socket.on("stopped", () => {
        io.emit("stopped_record");
    });
});

server.listen(3001, () => {
    console.log(`Server on port ${3001}`);
})