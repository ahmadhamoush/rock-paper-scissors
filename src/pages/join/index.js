import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { toast , Toaster} from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useRouter } from 'next/router'


let socket;
export default function Home() {

  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [players, setPlayers] = useState([]);
  const router = useRouter()
  
  useEffect(() => {
    socketInitializer()

    // Clean up event listeners
    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("playerJoined");
      socket.off("roomFull");
      socket.off("roomNotFound");
    };
  }, [])

  const socketInitializer = async () => {
    await fetch('/api/socket')
     socket = io({path:'/api/socket',transports:['websocket','polling']})
    socket.on('connect', () => {
      socket.emit('getID')
      console.log('connected',socket.id)
    })
 
      // Handle room created event
      socket.on("roomCreated", (roomId) => {
        setRoomId(roomId);
        console.log(`Room created: ${roomId}`);
      });
  
      // Handle room joined event
      socket.on("roomJoined", ({ roomId, players }) => {
        setRoomId(roomId);
        setPlayers(players);
        console.log(`Joined room: ${roomId}`);
        router.push(`/play/${roomId}`)

      });
  
      // Handle room full event
      socket.on("roomFull", () => {
        console.log("Room is full");
      });
  
      // Handle room not found event
      socket.on("roomNotFound", () => {
        console.log("Room not found");
      });
  
  }

  const handleCreateRoom = () => {
    socket.emit("createRoom");
  };

  const handleJoinRoom = () => {
    socket.emit("joinRoom", roomId,name);
  };
  return (
    <>
      <Head>
        <title>Join Room</title>
        <meta name="description" content="Rock Paper Scissors Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <h1>Rock Paper Scissors Shoot!</h1>
        <Toaster />
        <div className={styles.wrapper}>
        <input   placeholder='Your Name'  type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}/>
          <input   placeholder='Room id'  type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}/>
          <button onClick={handleJoinRoom}>Join</button>
          <button onClick={handleCreateRoom}>Created Room</button>
        </div>
      
      </main>
    </>
  )
}
