import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2 bg-white">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        
        <NavLink 
          className={({isActive}) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${isActive ? 'bg-[#ffebf5] border-[#ffb6d9]' : 'hover:bg-gray-50'}`} 
          to="/add"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="hidden md:block">Add Items</p>
        </NavLink>
        
        <NavLink 
          className={({isActive}) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${isActive ? 'bg-[#ffebf5] border-[#ffb6d9]' : 'hover:bg-gray-50'}`} 
          to="/list"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p className="hidden md:block">List Items</p>
        </NavLink>
        
        <NavLink 
          className={({isActive}) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${isActive ? 'bg-[#ffebf5] border-[#ffb6d9]' : 'hover:bg-gray-50'}`} 
          to="/orders"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="hidden md:block">Orders</p>
        </NavLink>

        <NavLink 
          className={({isActive}) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${isActive ? 'bg-[#ffebf5] border-[#ffb6d9]' : 'hover:bg-gray-50'}`} 
          to="/stripe-orders"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.105 0-2 .672-2 1.5S10.895 11 12 11s2 .672 2 1.5S13.105 14 12 14m0-6V5m0 14v-2m7-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="hidden md:block">Stripe Orders</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar