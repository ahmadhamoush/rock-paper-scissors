import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFistRaised, faHand, faHandBackFist, faHandFist, faHandScissors, faL, faUndo } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { toast , Toaster} from 'react-hot-toast'
import { useRouter } from 'next/router'

let socket;
export default function Play() {

  const router = useRouter()

  const choices = ['rock', 'paper', 'scissors'];
  
  const[player,setPlayer] = useState('')
  const[computer,setComputer] = useState('')
  const[result,setResult] = useState('')
  const[timer,setTimer] = useState(0)
  const[playerScore,setPlayerScore] = useState(0)
  const[cpuScore,setCPUscore] = useState(0)
  const[isPlaying,setIsPlaying] = useState(false)
  const[isFinished,setIsFinished] = useState(false)
    
  useEffect(() => {
    if (isFinished) {
      setResult(getResult());
      if (result !== '') {
        if(result === 'You win!'){
            setPlayerScore(prev=>prev + 1)
            toast.success(result)
        }
        else if(result === 'Computer wins!'){
            setCPUscore(prev=>prev + 1)

            toast.error(result)
        }
        else{
            toast(result)
        }
      }  
    }
  }, [isFinished,result]);


  const shoot = ()=>{

    if(player ===''){
      toast.error('Please pick a choice')
    }
    else{
      setIsPlaying(true)  
      setComputer(choices[Math.floor(Math.random()*choices.length)])
      setTimeout(()=>{  
        setIsPlaying(false)
        setIsFinished(true)     
      },3000)

     
      setTimeout(()=>{  
        setTimer(3)
      },3000)
      setTimeout(()=>{  
        setTimer(2)
      },4000)

      setTimeout(()=>{  
        setTimer(1)
      },5000)


      setTimeout(()=>{
        setTimer(0)
        setComputer('')
        setPlayer('')
        setResult('')
        setIsFinished(false)
      },6000)
  
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
  const reset = ()=>{
    setCPUscore(0)
    setPlayer(0)
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
       

    <h1>Rock Paper Scissors Shoot! <FontAwesomeIcon icon={faUndo} onClick={reset} className={styles.reset} /></h1>

  <div className={styles.scores}>
  <h3>Player {playerScore}</h3>
        <h3>CPU {cpuScore}</h3>
  </div>
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

    {timer > 0 && <div className={styles.timer}>
            <p>{timer}</p>
        </div>}
      </main>
    </>
  )
}
