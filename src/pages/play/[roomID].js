import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFistRaised, faHand, faHandBackFist, faHandFist, faHandScissors, faL } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { toast , Toaster} from 'react-hot-toast'
import { io } from 'socket.io-client'
import { useRouter } from 'next/router'

let socket;
export default function Play() {

  const router = useRouter()

  const choices = ['rock', 'paper', 'scissors'];
  
  const[player,setPlayer] = useState('')
  const[computer,setComputer] = useState('')
  const[result,setResult] = useState('')
  const[isPlaying,setIsPlaying] = useState(false)
  const[isFinished,setIsFinished] = useState(false)
  const [players, setPlayers] = useState([]);
    
  useEffect(() => {
    if (isFinished) {
      setResult(getResult());
    }
    if (result !== '' && isFinished) {
      toast.success(result)
    }  
  }, [isFinished,result]);

  useEffect(()=>{
    socketInitializer()
  },[router.query.roomID])

  const socketInitializer = async()=>{
    socket = io({path:'/api/socket',transports:['websocket','polling']})

      if(router.query.roomID){
        socket.emit("getRoomDetails", router.query.roomID)
      }
      socket.on("roomDetails", ( room ) => {
        console.log(room)
        console.log('Room id is: ' + room.roomId)
      });

         // Handle player joined event
         socket.on("playerJoined", ({ roomId, players }) => {
          setPlayers(players);
          console.log(`Player joined room: ${roomId}`);
          console.log(players)
        });
      
      socket.on('wait',()=>{
        alert('Wait for other player to join!')
      })
  }

  const shoot = ()=>{

    if(player ===''){
      toast.error('Please pick a choice')
    }
    else{
      // setIsPlaying(true)  
      socket.emit('makeMove', {id:socket.userId,roomId:router.query.roomID,move:player}) 
      // setComputer(choices[Math.floor(Math.random()*choices.length)])
      // setTimeout(()=>{  
      //   setIsPlaying(false)
      //   setIsFinished(true)     
      // },3000)

      // setTimeout(()=>{
      //   setComputer('')
      //   setPlayer('')
      //   setResult('')
      //   setIsFinished(false)
      // },6000)
  
    }
  }

  const getResult = ()=>{

    if(player === computer){
      return "It's a tie!"
    }
    else if((player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')){
      return 'You win!'
    }
    else{
      return 'Computer wins!'
    }
  }
  return (
    <>
      <Head>
        <title>Rock Paper Scissors</title>
        <meta name="description" content="Rock Paper Scissors Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

        <Toaster />
        <h1>Rock Paper Scissors Shoot!</h1>
    <div className={styles.hands}>
      {/* Player hand */}
    {!isFinished && <FontAwesomeIcon className={`${styles.fist} ${isPlaying && styles.leftHandAnime}`} icon={faHandBackFist} />}
    {isFinished && player ==='rock' &&  <FontAwesomeIcon className={styles.fist} icon={faFistRaised} /> }
    {isFinished && player ==='scissors' &&  <FontAwesomeIcon style={{transform: 'rotate(0) scaleX(-1)'}} className={styles.fist} icon={faHandScissors} /> }
    {isFinished && player ==='paper' &&  <FontAwesomeIcon className={styles.fist} icon={faHand} /> } 
      {/* Computer hand */}
    {!isFinished && <FontAwesomeIcon className={`${styles.fist} ${isPlaying && styles.rightHandAnime}`} icon={faHandBackFist} />}
    {isFinished && computer ==='rock' &&  <FontAwesomeIcon className={styles.fist} icon={faFistRaised} /> }
    {isFinished && computer ==='scissors' &&  <FontAwesomeIcon style={{transform: 'rotate(0)'}} className={styles.fist} icon={faHandScissors} /> }
    {isFinished && computer ==='paper' &&  <FontAwesomeIcon className={styles.fist} icon={faHand} /> } 
    </div>
    <div className={styles.wrapper}>
    <div className={styles.icons}>
    <FontAwesomeIcon onClick={()=>setPlayer('rock')} className={`${styles.icon} ${player === 'rock' && styles.active}`} icon={faFistRaised} />
    <FontAwesomeIcon onClick={()=>setPlayer('paper')} className={`${styles.icon} ${player === 'paper' && styles.active}`}  icon={faHand} />
    <FontAwesomeIcon style={{transform: 'rotate(90deg)'}} onClick={()=>setPlayer('scissors')} className={`${styles.icon} ${player === 'scissors' && styles.active}`}  icon={faHandScissors} />
    </div>
    <button onClick={shoot} >{isPlaying ? 'Playing...' : 'Shoot'}</button>
    </div> 
      </main>
    </>
  )
}
