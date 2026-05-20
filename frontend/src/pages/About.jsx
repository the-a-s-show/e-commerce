import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>XOR was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our platform combines cutting-edge technology with a user-centric approach to deliver a seamless shopping experience.</p>
          <p>Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. Our commitment to excellence extends beyond our products to encompass the entire customer journey – from browsing to checkout to delivery.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission at XOR is to empower customers with choice, convenience, and confidence. We aim to be the trusted destination for quality products at competitive prices, with an emphasis on sustainable practices and ethical sourcing.</p>
        </div>
      </div>

      <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='flex flex-col items-center justify-center border px-10 md:px-16 py-8 sm:py-20 gap-5'>
          <img src={assets.quality_icon} alt="" />
          <p className='font-semibold'>Quality Assurance</p>
          <p className='text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
        </div>
        <div className='flex flex-col items-center justify-center border px-10 md:px-16 py-8 sm:py-20 gap-5'>
          <img src={assets.exchange_icon} alt="" />
          <p className='font-semibold'>Convenience</p>
          <p className='text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
        </div>
        <div className='flex flex-col items-center justify-center border px-10 md:px-16 py-8 sm:py-20 gap-5'>
          <img src={assets.support_img} alt="" />
          <p className='font-semibold'>Exceptional Customer Service</p>
          <p className='text-gray-600'>Our team of dedicated professionals is here to assist you the moment you need us.</p>
        </div>
      </div>
    </div>
  )
}

export default About
