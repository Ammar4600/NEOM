import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Context/userContext';


function Register() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [name , setname]= useState('');
  const [email , setemail] = useState('');
  const [password , setpassword] = useState('');
  const nevigate = useNavigate()
   const { setUser } = useContext(UserContext);


  async function SubmitHandler(e) {
    e.preventDefault();
   const response = await axios.post(`${baseUrl}/register`, {name, email, password}
    
   )
    if(response.status === 200){
      setUser(response.data.user)

      localStorage.setItem('token' , response.data.token);
      nevigate('/')
    }
    else{
      setname('')
      setemail('')
      setpassword('')
      console.error(error.message);
    }
    
  }

  return (
    <div className='bg-[#686279] h-screen w-screen max-sm:p-5 py-7 px-15'>
      <div className='bg-[#2C2638] h-full w-full rounded-3xl flex'>
        <div className="part1 overflow-hidden max-sm:hidden  sm:hidden md:flex lg:flex md:w-[45%] lg:w-[50%] relative flex flex-col justify-end items-center  rounded-3xl  bg-center  bg-[url(https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwwfHwwfHx8MA%3D%3D)]  bg-cover">
          <h1 className='bg-white p-3 text-2xl font-bold  absolute rounded-2xl top-5 left-5 '>Devil.Ai</h1>
          <p className='text-base text-black  p-4 mb-2 bg-white rounded-2xl'>Powered by Ammar_Technologies</p>
          <div className="part2 w-[50%] relative">

          </div>

        </div>
        <div className="part2 relative max-sm:w-[100%] sm:w-[100%]  md:w-[65%] lg:w-[50%] pb-18 flex flex-col gap-15 items-center justify-center ">
          <div className='relative w-[66%]'>

          <div className='flex flex-col pb-10 gap-5 text-center w-[100%]'>
            <h1 className='text-white  max-sm:text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-semibold'>Create Account</h1>
            <p className='text-neutral-300  text-base'>Already have an account ? <span><Link to={'/login'} className=' px-1 text-blue-200 underline'>Login</Link></span></p>
          </div>
          <form className='flex flex-col gap-7 pb-10 w-full' >
            <input value={name} onChange={(e)=>{setname(e.target.value)}} className='bg-[#3c364c] px-8 py-4 text-white rounded-md font-medium text-[1.2rem] w-full' type="text" required placeholder='Name' />
            <input value={email} onChange={(e)=>{setemail(e.target.value)}} className='bg-[#3c364c] px-8 py-4 rounded-md text-white font-medium  text-[1.2rem]  w-full' type="email" placeholder='Email' required />
            <input value={password} onChange={(e)=>{setpassword(e.target.value)}} className='bg-[#3c364c] px-8 py-4 rounded-md text-white font-medium  text-[1.2rem]  w-full' type="password" required placeholder='Enter your password' />
            <span  className='text-neutral-300  text-base'><input type="checkbox" /> I agree to the Terms & Conditions</span>
          </form>
          <button onClick={SubmitHandler} className=' cursor-pointer bg-[#6d54b5] text-white w-full text-center font-bold text-xl p-4 rounded-md absolute '>Create Account</button>
          <div>

          </div>
          </div>
        </div>
      </div>
    </div>
   
  )
}

export default Register
