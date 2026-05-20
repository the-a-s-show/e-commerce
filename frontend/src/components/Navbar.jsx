
import React, { useContext, useEffect, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { useLocation } from 'react-router-dom'

const Navbar = () => {
  const [visible,setVisible] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { setShowSearch, getCartCount, token, setToken } = useContext(ShopContext)
  const navigate = useNavigate();
  const location = useLocation();
  const disableProfileHover = location.pathname === '/login' || location.pathname === '/signup';

  const handleProfileClick = () => {
    if (!token) {
      navigate('/login');
    } else {
      setShowProfileMenu(prev => !prev);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken('');
    setShowProfileMenu(false);
    navigate('/');
  };

  useEffect(() => {
    setShowProfileMenu(false)
  }, [location.pathname])

  return (
    <div className='relative flex items-center justify-between py-5 font-medium'>
      
      <Link to='/'><img src={assets.logo} className='w-44 h-auto object-contain' alt="" /></Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700 absolute left-1/2 transform -translate-x-1/2'>
        <NavLink to='/' end>
          {({ isActive }) => (
            <div className={'flex flex-col items-center gap-1'}>
              <p className={isActive ? 'text-gray-900' : ''}>Home</p>
              <hr className={isActive ? 'w-8 border-none h-[1.5px] bg-gray-700' : 'w-8 border-none h-[1.5px] bg-gray-700 hidden'} />
            </div>
          )}
        </NavLink>

        <NavLink to='/collection'>
          {({ isActive }) => (
            <div className={'flex flex-col items-center gap-1'}>
              <p className={isActive ? 'text-gray-900' : ''}>Collection</p>
              <hr className={isActive ? 'w-8 border-none h-[1.5px] bg-gray-700' : 'w-8 border-none h-[1.5px] bg-gray-700 hidden'} />
            </div>
          )}
        </NavLink>

        <NavLink to='/about'>
          {({ isActive }) => (
            <div className={'flex flex-col items-center gap-1'}>
              <p className={isActive ? 'text-gray-900' : ''}>About</p>
              <hr className={isActive ? 'w-8 border-none h-[1.5px] bg-gray-700' : 'w-8 border-none h-[1.5px] bg-gray-700 hidden'} />
            </div>
          )}
        </NavLink>

        <NavLink to='/contact'>
          {({ isActive }) => (
            <div className={'flex flex-col items-center gap-1'}>
              <p className={isActive ? 'text-gray-900' : ''}>Contact</p>
              <hr className={isActive ? 'w-8 border-none h-[1.5px] bg-gray-700' : 'w-8 border-none h-[1.5px] bg-gray-700 hidden'} />
            </div>
          )}
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="" className='w-5 cursor-pointer' />
        <div className={`relative ${disableProfileHover ? '' : 'group'}`}>
          <button type='button' onClick={handleProfileClick} className='block w-5 h-5'>
            <img src={assets.profile_icon} alt="" className='w-5 cursor-pointer' />
          </button>
          {token && (
            <div className={`absolute dropdown-menu pt-4 right-0 hidden ${showProfileMenu ? 'block' : ''} ${disableProfileHover ? '' : 'group-hover:block'}`}>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-gray-100 text-gray-700 rounded'>
                  <Link to='/profile' className='cursor-pointer hover:text-black'>My Profile</Link>
                  <Link to='/orders' className='cursor-pointer hover:text-black'>Orders</Link>
                  <button onClick={handleLogout} className='cursor-pointer hover:text-black text-left'>Logout</button>
              </div>
            </div>
          )}
        </div>
        <Link to ='/cart' className='relative'>
            <img src={assets.cart_icon} alt="" className='w-5 min-w-5' />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>

        <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="" className='w-5 cursor-pointer sm:hidden' />
      </div>

        <div className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-300 ${visible ? 'w-full sm:w-96' : 'w-0'}`}>
          <div className='flex flex-col text-gray-600'>
                <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                    <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="" />
                    <p>
                        Back
                    </p>
                </div>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/'> HOME </NavLink>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection'> COLLECTION </NavLink>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/about'> ABOUT </NavLink>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/contact'> CONTACT </NavLink>
            </div>
        </div>
    </div> 
  )
}

export default Navbar
