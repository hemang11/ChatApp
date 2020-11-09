const express = require('express')
        path  = require('path')
        http  = require('http')
        socket= require('socket.io');
        cors  = require('cors')

const app = express(); // instanciating the ap object
const server = http.createServer(app); // creating a server on app so that sockets can connect
app.use(cors()); // use cors for cross origin request

// Serving the static files in the public folder
app.use(express.static(path.join(__dirname,'public'))); // this will render the index.html file in public

// Making a socket of server thorugh which all clients will be connected
const io = socket(server); // Socket object io kind of server

// Run when client connects 
io.on('connection',socket=>{ // Listening for connection
    console.log(`Client connected with ID : ${socket.id}`);

    // Sends message to client that new user is connected
    socket.on('new',data =>{
        io.emit('new',data);
    })

    // Server broadcasting messages received froma a client to all the clients
    socket.on('message',data=>{
        socket.broadcast.emit('message',data);
    })

    //On disconnect emit message to everyone
    socket.on('disconnect',()=>{
        io.emit('Disconnect','User Disconnected')
    });
})

// socket.emit = emit to single client , io.emit = emit to everyone including you, 
// socket.broadcast.emit = emit to everyone excepts you


const PORT = process.env.PORT || 4040;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})