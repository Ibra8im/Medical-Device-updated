import React, { useContext } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { ImBarcode } from 'react-icons/im'
import { IoIosApps } from 'react-icons/io'
import { MdDeviceHub } from 'react-icons/md'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Hero = () => {

  const { token } = useContext(AppContext)
  const navigate = useNavigate()

  const handelGetStarted = () => {
    if (token) {
      navigate('/device')
    } else {
      navigate('/auth')
    }
  }

  return (
    <div className='mt-2 flex flex-col items-center'>
      <p className='text-center text-sm px-2 py-1 rounded bg-gray-200 w-fit'>Medical Devices Management System</p>
      <h1 className='text-xl text-center mt-15 sm:text-3xl md:text-4xl lg:text-6xl font-bold mx-3'>Streamline Your Medical Device Operations</h1>
      <p className='text-center text-gray-400 text-sm sm:text-base md:text-md lg:text-2xl mt-5 '>A comprehensive platform for managing medical devices, manufacturers, and suppliers </p>
      <p className='text-center text-gray-400 text-sm sm:text-base md:text-md lg:text-2xl mt-2'>with advanced search capabilities and secure data management.</p>
      <div className='flex items-center gap-4 mt-7'>
        <div onClick={handelGetStarted} className='flex items-center justify-center gap-2 group text-white bg-black px-5 py-2 transition-all duration-200 rounded-md hover:bg-gray-800 cursor-pointer '>
          <p className='text-base font-medium'>Explore Devices</p>
          <FaArrowRight className='mt-1' />
        </div>
        <p onClick={handelGetStarted} className='text-base font-medium border border-gray-300 px-5 py-2 rounded-md hover:bg-gray-200 cursor-pointer'>Get Started</p>
      </div>

      <div className='w-[90%] sm:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-20'>
        <div className='flex flex-col items-center justify-center border-2 border-gray-100 rounded-xl shadow-md' >
          <div className='px-10 pt-6 pb-3 flex flex-col items-center'>
            <MdDeviceHub className='text-6xl  ' />
            <p className='text-2xl font-bold mt-1'>1,000+</p>
            <p className='text-base text-gray-500 font-normal'>Medical Devices</p>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center border-2 border-gray-100 rounded-xl shadow-md' >
          <div className='px-10 pt-6 pb-3 flex flex-col items-center'>
            <IoIosApps className='text-6xl  ' />
            <p className='text-2xl font-bold mt-1'>150+</p>
            <p className='text-base text-gray-500 font-normal'>Distributors</p>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center border-2 border-gray-100 rounded-xl shadow-md' >
          <div className='px-10 pt-6 pb-3 flex flex-col items-center'>
            <ImBarcode className='text-6xl  ' />
            <p className='text-2xl font-bold mt-1'>200+</p>
            <p className='text-base text-gray-500 font-normal'>Manufacturers</p>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center border-2 border-gray-100 rounded-xl shadow-md' >
          <div className='px-10 pt-6 pb-3 flex flex-col items-center'>
            <MdDeviceHub className='text-6xl  ' />
            <p className='text-2xl font-bold mt-1'>50+</p>
            <p className='text-base text-gray-500 font-normal'>Countries</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
