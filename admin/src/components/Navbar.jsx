import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between bg-white border-b shadow-sm">
      <img className="w-[max(12%,96px)] h-auto object-contain" src={assets.logo} alt="" />
      <button 
        onClick={() => setToken('')} 
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-800 transition-colors"
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar