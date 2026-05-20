import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Delivery from './pages/Delivery'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderTrack from './pages/OrderTrack'
import Profile from './pages/Profile'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Search from './components/Search'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <Search />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/delivery' element={<Delivery />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders/:orderId' element={<OrderTrack />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/order-confirmation' element={<OrderConfirmation />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App