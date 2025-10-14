import React from 'react'
import { FaDatabase, FaRegHeart } from 'react-icons/fa'
import { ImBarcode } from 'react-icons/im'
import { BsPersonFillCheck } from "react-icons/bs";
import { TfiSearch } from "react-icons/tfi";
import { MdSecurity } from 'react-icons/md';


const Feature = () => {
  return (
    <div className='flex flex-col items-center my-20 '>

      <div >
        <h1 className='text-center text-3xl font-bold'>Powerful Features</h1>
        <p className='text-center text-lg mt-3 tracking-[2px] text-gray-500'>Everything you need to manage medical devices, manufacturers, and suppliers <br /> efficiently</p>
      </div>

      <div className='w-[90%] sm:w-[80%] mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6'>

        <div className=' border-3 border-gray-200 rounded-xl group hover:shadow-lg'>
          <div className='flex flex-col items-start gap-3 px-6 py-8'>
            <FaRegHeart className='text-red-500 text-4xl ' />
            <p className='text-base font-semibold '>Medical Devices</p>
            <p className='text-sm text-gray-400  '>Comprehensive database of medical devices with detailed specifications, images, and pricing information.</p>
          </div>
        </div>

        <div className=' border-3 border-gray-200 rounded-xl group hover:shadow-lg'>
          <div className='flex flex-col items-start gap-3 px-6 py-8'>
            <ImBarcode className='text-green-500 text-4xl ' />
            <p className='text-base font-semibold '>Manufacturers</p>
            <p className='text-sm text-gray-400  '>Track manufacturers worldwide with agent information and country-specific details</p>
          </div>
        </div>

        <div className=' border-3 border-gray-200 rounded-xl group hover:shadow-lg'>
          <div className='flex flex-col items-start gap-3 px-6 py-8'>
            <BsPersonFillCheck className='text-blue-500 text-4xl ' />
            <p className='text-base font-semibold '>Suppliers</p>
            <p className='text-sm text-gray-400  '>Manage supplier networks with contact information and distributor relationships.</p>
          </div>
        </div>

        <div className=' border-3 border-gray-200 rounded-xl group hover:shadow-lg'>
          <div className='flex flex-col items-start gap-3 px-6 py-8'>
            <TfiSearch className='text-purple-400 text-4xl ' />
            <p className='text-base font-semibold '>Advanced Search</p>
            <p className='text-sm text-gray-400  '>Powerful search and filtering capabilities to find exactly what you need.</p>
          </div>
        </div>

        <div className=' border-3 border-gray-200 rounded-xl group hover:shadow-lg'>
          <div className='flex flex-col items-start gap-3 px-6 py-8'>
            <MdSecurity className='text-orange-300 text-4xl ' />
            <p className='text-base font-semibold '>Secure Access</p>
            <p className='text-sm text-gray-400  '>Role-based authentication ensures data security and controlled access.</p>
          </div>
        </div>

        <div className=' border-3 border-gray-200 rounded-xl group hover:shadow-lg'>
          <div className='flex flex-col items-start gap-3 px-6 py-8'>
            <FaDatabase className='text-green-600 text-4xl ' />
            <p className='text-base font-semibold '>Data Management</p>
            <p className='text-sm text-gray-400  '>Comprehensive CRUD operations with real-time updates and data validation.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Feature
