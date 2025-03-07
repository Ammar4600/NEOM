import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Context/userContext';



function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name , setName] = useState('');
  const nevigate = useNavigate();
   const { setUser } = useContext(UserContext);


  async function SubmitHandler(e) {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, { name ,email, password });
      if (response.status === 200) {
        setUser(response.data.user);
        localStorage.setItem('token' , response.data.token);
        nevigate('/');
      } 
      
    } catch (error) {
      setName('')
      setEmail('')
      setPassword('')
      console.error(error.message);
    }
  
  }



  return (
    <div className='bg-[#686279] h-screen w-screen max-sm:p-5 py-7 px-15'>
      <div className='bg-[#2C2638] h-full lg:w-full rounded-3xl flex'>
        <div className="part1 overflow-hidden max-sm:hidden  sm:hidden md:flex lg:flex md:w-[45%] lg:w-[50%] relative flex  flex-col justify-end items-center  rounded-3xl  bg-center  bg-[url(https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwwfHwwfHx8MA%3D%3D)]  bg-cover">
          <h1 className='bg-white p-3 text-2xl font-bold  absolute rounded-2xl top-5 left-5 '>Devil.Ai</h1>
          <p className='text-base text-black  p-4 mb-2 bg-white rounded-2xl'>Powered by Ammar_Technologies</p>
     

        </div>
        <div className="part2 relative max-sm:w-[100%] sm:w-[100%]  md:w-[65%] lg:w-[50%] pb-18 flex flex-col gap-15 items-center justify-center  ">
          <div className=' men relative w-[66%] flex flex-col'>

          <div className=' abc flex flex-col pb-10 max-sm:gap-2 md:gap-2 lg:gap-5 text-center w-[100%]'>
            <h1 className='text-white max-sm:text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-semibold'>Login to  your account</h1>
            <p className='text-neutral-300  text-base'>Don't have an account ? <span><Link to={'/register'} className=' px-1 text-blue-200 underline'>Create Account</Link></span></p>
          </div>
          <form className='flex flex-col gap-7 pb-10 w-full' >
            <input onChange={(e)=>{setName(e.target.value)}} value={name} className='bg-[#3c364c] px-8 py-4 text-white rounded-md font-medium text-[1.2rem] w-full' type="text" required placeholder='Name' />
            <input onChange={(e)=>{setEmail(e.target.value)}} value={email}  className='bg-[#3c364c] px-8 py-4 rounded-md text-white font-medium  text-[1.2rem]  w-full' type="email" placeholder='Email' required />
            <input onChange={(e)=>{setPassword(e.target.value)}} value={password}  className='bg-[#3c364c] px-8 py-4 rounded-md text-white font-medium  text-[1.2rem]  w-full' type="password" required placeholder='Enter your password' />
            <span  className='text-neutral-300  text-base'><input type="checkbox" /> I agree to the Terms & Conditions</span>
          </form>
          <Link onClick={SubmitHandler} className='bg-[#6d54b5] text-white w-full text-center font-bold text-xl p-4 rounded-md  '>Login</Link>
          
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
