import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

const Login = () => {

  const [currentState, setCurrentState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = currentState === 'Sign Up' ? '/api/user/register' : '/api/user/login';
      const payload = currentState === 'Sign Up'
        ? { name, email, password }
        : { email, password };

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      // Backend returns { success: boolean, ... }
      // check the success flag in the response body rather than response.ok
      if (!data.success) {
        toast.error(data.message || 'Request failed');
        setLoading(false);
        return;
      }

      toast.success(data.message || 'Success');

      // If signup, switch to login mode
      if (currentState === 'Sign Up') {
        setCurrentState('Login');
        setName('');
        setEmail('');
        setPassword('');
        toast.info('Please login with your credentials');
      } else {
        // If login, save token and redirect to home
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId || '');
          navigate('/');
          toast.success('Logged in successfully!');
        }
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      toast.error(error.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {
        currentState === 'Sign Up' ? <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required /> : null
      }

      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState === 'Login' ?
            <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
            :
            <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>

      <button 
        type='submit' 
        disabled={loading}
        className='w-full bg-black text-white font-light py-2 mt-4 disabled:bg-gray-400'
      >
        {loading ? (currentState === 'Login' ? 'Logging in...' : 'Creating account...') : (currentState === 'Login' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  )
}

export default Login