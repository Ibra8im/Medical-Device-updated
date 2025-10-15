import React from 'react'
import Hero from '../components/Hero'
import Feature from '../components/Feature'
import GetStarted from '../components/GetStarted'

const Home = () => {
  return (
    <div className='relative mt-30' >
      <Hero />
      <Feature />
      <GetStarted />
    </div>
  )
}

export default Home
