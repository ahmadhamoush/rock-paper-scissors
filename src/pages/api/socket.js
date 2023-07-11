import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server,{path:'/api/socket',transports:['websocket','polling']})
  res.socket.server.io = io;

  const rooms = new Map(); // Map to store room information

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.userId =socket.id
    // Handle create room event
    socket.on("createRoom", () => {
      const roomId = generateRoomId(); // Generate a unique room ID
      const roomData = { roomId, players: [] };
  
      rooms.set(roomId, roomData); // Store room information
      // console.log(rooms)
  
      socket.join(roomId); // Join the room
      socket.emit("roomCreated", roomId); // Send the room ID to the client
    });
  
    // Handle join room event
    socket.on("joinRoom", (roomId,name) => {
      const roomData = rooms.get(roomId);
        // console.log(rooms)
        // console.log(roomData)
      if (roomData) {
        const { roomId, players } = roomData;
        if (players.length < 2) {
          socket.join(roomId); // Join the room
          let player = {name,id:socket.userId}
          players.push(player); // Add the socket ID to the players list
  
          // Notify the client that they have successfully joined the room
          socket.emit("roomJoined", { roomId, players });
  
          // Notify all clients in the room about the new player
          io.to(roomId).emit("playerJoined", { roomId, players });
        } else {
          socket.emit("roomFull"); // Notify the client that the room is full
        }
      } else {
        socket.emit("roomNotFound"); // Notify the client that the room does not exist
      }
    });
  
    socket.on('getRoomDetails', (roomId)=>{
      const roomData = rooms.get(roomId);
      socket.emit("roomDetails",  roomData );
    })
    
    // Handle game events
    socket.on("makeMove", (data) => {
      const roomData = rooms.get(data.roomId);
     const{players}=roomData
     console.log('socket userid',socket.userId)

    if(players.length>1){
      players.forEach(player=>{
        console.log('player id',player.id)
        if(socket.userId === player.id){
          player.move = data.move
          player.isPlaying = true
        }
      })
    }
    else{
      socket.emit('wait')
    }
      console.log(players)
      // Handle game logic here
      // Emit game events to clients in the same room
    });
  
    // Handle disconnect event
    socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Remove the user from all rooms
    rooms.forEach((room) => {
      const index = room.players.indexOf(socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);
        socket.leave(room.id);
        console.log('User left room:', room.id);
      }
    });
  });
});
  
  function generateRoomId() {
    // Generate a random alphanumeric room ID
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const roomIdLength = 6;
    let roomId = "";
    for (let i = 0; i < roomIdLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomId += characters.charAt(randomIndex);
    }
    return roomId;
  }
  

  console.log("Setting up socket");
  res.end();
}