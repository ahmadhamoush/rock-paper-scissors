import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import { useRouter } from 'next/router'


export default function Home() {
const router = useRouter()
  return (
    <>
      <Head>
        <title>Rock Paper Scissors</title>
        <meta name="description" content="Rock Paper Scissors Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <h1>Rock Paper Scissors Shoot!</h1>
        <div className={styles.wrapper}>
          <button onClick={()=>router.push('/join')}>2 v 2</button>
          <button onClick={()=>{router.push('/play/cpu')}}>Computer</button>
        </div>
      
      </main>
    </>
  )
}
