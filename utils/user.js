// All this code should be implemented in the DB

const users=[]; // This is the list of all the users irrespective of the Room

function addUser(id,name,room)
{
    const user = {
        id : id,
        name:name,
        room:room
    }

    users.push(user);
    return user;
}

function getUser(id)
{
    return users.find(user => user.id === id); // Will return just one User
}

function leaveUser(id)
{
    // Returned the User left
    const index = users.findIndex(user => user.id === id)
    if(index!==-1){
        return users.splice(index,1)[0] // Return the User Left as a Object
    }
}

function getRoomUser(room){
    const roomUser = users.filter(user => user.room === room)
    return roomUser; // Array is returned
}

module.exports = {
    addUser,getUser,leaveUser,getRoomUser
};
