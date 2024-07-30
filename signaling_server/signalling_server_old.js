const { Server } = require('socket.io');
// const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');

// Define the port number
const PORT = 9977;

const server = https.createServer({
    key: fs.readFileSync('/var/www/vhosts/itsabacus.co/teleh.itsabacus.co/keys/privkey.pem'),
    cert: fs.readFileSync('/var/www/vhosts/itsabacus.co/teleh.itsabacus.co/keys/fullchain.pem')
});

// const io = new WebSocket.Server({ server });

const io = new Server(server, {
    cors: true,
});

server.listen(9977, () => {
    console.log(`Signalling server is now listening on port ${PORT}`);
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);

    socket.on("room:join", (data) => {
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);
        io.to(room).emit("user:joined", { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
    });

    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
});
