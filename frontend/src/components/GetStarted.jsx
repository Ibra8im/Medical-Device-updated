import React from 'react'

const GetStarted = () => {
  return (
    <div className='w-[90%] sm:w-[80%] mx-auto bg-gray-100'>
      <div className='flex flex-col items-center gap-6 py-15 px-5'>
        <h1 className='text-3xl font-bold'>Ready to Get Started?</h1>
        <p className='text-center text-xl text-gray-600'>Join our platform and start managing your medical device data more efficiently <br /> today.</p>
        <div className='flex flex-col sm:flex-row mt-3 gap-4'>
          <p className='text-lg text-white font-normal px-6 py-2 rounded-xl bg-black cursor-pointer'>Create Account</p>
          <p className='text-lg text-black font-normal px-6 py-2 border-2 border-gray-200 rounded-xl bg-white cursor-pointer'>Browse Devices</p>
        </div>
      </div>
    </div>
  )
}

export default GetStarted
