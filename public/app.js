const socket = io.connect('http://localhost:4040'); // Client connecting to the server
const msg = document.querySelector('#msg');
const sendbtn = document.querySelector('.send');
const chatmsg = document.querySelector('.chat-messages');
const ul = document.getElementById('users');

const url = document.URL.split('?')[1];
const username = url.split('&')[0].split('=')[1];
const room = url.split('&')[1].split('=')[1]
const room_name = document.getElementById('room-name').innerHTML=room;
const date = new Date().toLocaleString;
console.log(date);

sendbtn.addEventListener('click',e=>{
    e.preventDefault();

    if(msg.value!=''){

    socket.emit('message',{
        user:username,
        msg:msg.value
    });

    addToDom({
        user:username,
        msg:msg.value
    });

    }
});


function addToDom(data){
    msg.value='';
    const div = document.createElement('div');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const span = document.createElement('span');
    const t1 = document.createTextNode(data.msg)
    const t2 = document.createTextNode(`${data.user} `)
    const t3 = document.createTextNode('9.12')
    p2.className = 'text';
    p1.className = 'meta';
    span.appendChild(t3);
    p1.appendChild(t2);
    p1.appendChild(span);
    p2.appendChild(t1);

    div.appendChild(p1);
    div.appendChild(p2);
    div.className='message'

    chatmsg.appendChild(div);
}

socket.emit('new',username)

socket.on('new',data=>{ // New Client Connected
    const li = document.createElement('li');
    const text = document.createTextNode(data);
    li.appendChild(text);
    ul.appendChild(li);
})

socket.on('message',data=>{
    addToDom(data);
    console.log(data);
    // socket.broadcast.emit(data); // Broadcast is not defined on client side
})

socket.on('Disconnect',data=>{
    addToDom({
        user:'User',
        msg:data
    })
})