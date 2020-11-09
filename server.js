const express = require('express')
        path  = require('path')
        http  = require('http')
        socket= require('socket.io')
        cors  = require('cors')
        moment= require('moment')

const {addUser,getUser,leaveUser,getRoomUser} = require('./utils/user.js');

const app = express(); // instanciating the ap object
const server = http.createServer(app); // creating a server on app so that sockets can connect
app.use(cors()); // use cors for cross origin request

// Serving the static files in the public folder
app.use(express.static(path.join(__dirname,'public'))); // this will render the index.html file in public

// Date set by moment JS
    function format(name,msg){
        return {
            user:name,
            msg:msg,
            time:moment().format('h:mm a')
        };
    }

// Making a socket of server thorugh which all clients will be connected
const io = socket(server); // Socket object io kind of server

// Run when client connects 
io.on('connection',socket=>{ // Listening for connection

        // Join Room All things will happen here when user joins
        socket.on('join-room',data =>{ // In the data we have user and room

            // Add new User to DB user returned is the newly added user
            const user = addUser(socket.id,data.user,data.room);
            socket.join(user.room) // Join to the specific room

            // Emitting roomUsers for the sideBar
            const roomUsers = getRoomUser(user.room);
            //console.log(roomUsers);
            io.to(user.room).emit('roomUser',roomUsers);

            // New User joins Chatbot sends message to that client who joined
            socket.emit('message',format('Chatbot',`${user.name} has joined`))

            // Broadcasting to all people in the group that the client has joined 9except the client
            socket.broadcast.to(user.room).emit('message',format('Chatbot',`${user.name} joined the chat`))
        })

        // Chat messages
        // We first getUser of a particluar socketID and then perform chatmessage
        socket.on('chatmessage',data =>{   // Handling chat Messages
            const curr_user = getUser(socket.id);
            io.to(curr_user.room).emit('chatmessage',format(data.user,data.msg));
        })

        //On disconnect emit message to everyone in the Room
        // We first getUser of a particluar socketID and then perform disconnnection
        socket.on('disconnect',()=>{

            const user = leaveUser(socket.id);
            if(user){ // If Users are still in the Room
            io.to(user.room).emit('message',format('Chatbot',`${user.name} left the chat`));

            const roomUsers = getRoomUser(user.room);
            io.to(user.room).emit('roomUser',roomUsers); // roomUsers is an array of All Users in the room
            }
        });

})

// socket.emit = emit to single client , io.emit = emit to everyone including you, 
// socket.broadcast.emit = emit to everyone excepts you


const PORT = process.env.PORT || 4040;

// Should be server.listen for socket connection as our new server is Server
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})