import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { toast , Toaster} from 'react-hot-toast'


export default function Home() {

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
          <input placeholder='Your name' />
          <input placeholder='Room id' />
          <button>Join</button>
        </div>
      
      </main>
    </>
  )
}
