import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Contact = () => {

  const onSubmitHandler = (e) => {
    e.preventDefault();
  }

  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>
            54 William St <br /> London, UK 10001 <br /> Tel: (212) 555-0132 <br /> Email: admin@xor.com
          </p>
          <p className='font-semibold text-xl text-gray-600'>Careers at XOR</p>
          <p className='text-gray-500'>
            Learn more about our teams and job openings.
          </p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

      <div className='my-10'>
        <div className='text-center text-2xl'>
          <Title text1={'NEWSLETTER'} text2={'SIGNUP'} />
        </div>
        <p className='text-center text-gray-500 mt-3 mb-9'>Subscribe to our newsletter and stay updated on the latest offers and news.</p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
          <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required />
          <button type='submit' className='bg-black text-white text-xs px-10 sm:px-16 py-4'>SUBSCRIBE</button>
        </form>
      </div>

    </div>
  )
}

export default Contact
