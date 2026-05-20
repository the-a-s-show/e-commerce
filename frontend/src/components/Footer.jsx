import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  const companyLinks = [
    { label: 'Home', to: '/' },
    { label: 'About us', to: '/about' },
    { label: 'Delivery', to: '/delivery' },
    { label: 'Privacy policy', to: '/privacy-policy' },
  ]

  return (
    <div>

      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <img src={assets.logo} className='mb-5 w-36 object-contain' alt="" />

          <p className='w-full md:w-2/3 text-gray-600'>
            Your destination for modern essentials, standout styles, and everyday pieces that fit your life.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>

          <ul className='flex flex-col gap-1 text-gray-600'>
            {companyLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className='hover:text-black transition-colors'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>

          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>
              <a href="tel:+12124567890" className='hover:text-black transition-colors'>
                +1-212-456-7890
              </a>
            </li>
            <li>
              <a href="mailto:contact@xor.com" className='hover:text-black transition-colors'>
                contact@xor.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      <hr />

      <p className='py-5 text-sm text-center'>
        Copyright 2024@ xor.com - All Right Reserved.
      </p>

    </div>
  )
}

export default Footer                                                   