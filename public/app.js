const socket = io.connect('http://localhost:4040'); // Client connecting to the server
const msg = document.querySelector('#msg');
const sendbtn = document.querySelector('.send');
const chatmsg = document.querySelector('.chat-messages');
const ul = document.getElementById('users');

const url = document.URL.split('?')[1];
const username = url.split('&')[0].split('=')[1];
const room = url.split('&')[1].split('=')[1]
const room_name = document.getElementById('room-name').innerHTML=room;

// Join Room Whenever User connected it goes to a particular room
socket.emit('join-room',{
    user:username,
    room:room
});

sendbtn.addEventListener('click',e=>{
    e.preventDefault();

    if(msg.value!=''){

    socket.emit('chatmessage',{
        user:username,
        msg:msg.value
    });
    }
});


function addToDom(data){
    
    msg.value='';

// We have to append div(with inner HTML) to the div (of chat-message)
    // 1. Create a div element of message class and add inner HTML to it
    const div = document.createElement('div');
    div.classList.add('message'); // Can use className here
    div.innerHTML = `
    <p class="meta">${data.user} <span>${data.time}</span></p>
    <p class="text">
        ${data.msg}
    </p>
    `
    // 2. Append the div
    chatmsg.appendChild(div);

    // 3. Scroll Down  - This automatically brings down chatmsg scrollbar
    chatmsg.scrollTop = chatmsg.scrollHeight;

// Long method to do the same
    // const div = document.createElement('div');
    // const p1 = document.createElement('p');
    // const p2 = document.createElement('p');
    // const span = document.createElement('span');
    // const t1 = document.createTextNode(data.msg)
    // const t2 = document.createTextNode(`${data.user} `)
    // const t3 = document.createTextNode('9.12')
    // p2.className = 'text';
    // p1.className = 'meta';
    // span.appendChild(t3);
    // p1.appendChild(t2);
    // p1.appendChild(span);
    // p2.appendChild(t1);

    // div.appendChild(p1);
    // div.appendChild(p2);
    // div.className='message'

    // chatmsg.appendChild(div);
}

// Listening on messages from client about joined or leave
socket.on('message',data=>{

    addToDom(data);
    //console.log(data);
    // socket.broadcast.emit(data); // Broadcast is not defined on client side
})

socket.on('chatmessage',data=>{
    addToDom(data);
})

socket.on('roomUser',data=>{ // Data is Array of users in the room
    ul.innerHTML = ''; // this is done to avoid duplicates Setting all ul = none
    data.forEach(user=>{
        const li = document.createElement('li');
        li.innerHTML = `${user.name}`;
        ul.appendChild(li);
    })
})
