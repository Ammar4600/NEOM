import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../Context/userContext'
import {  useNavigate } from 'react-router-dom';
import { gsap } from "gsap";
import axios from 'axios';

function Home() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState('');
  const [modal, setmodal] = useState(false)
  const [projects , setprojects] = useState([]);
  const nevigate = useNavigate();
  

  useEffect(() => {
    if (modal) {
      gsap.to('.blur', { opacity: 2, display: 'block', duration: 0.5, ease: 'elastic' });
    } else {
      gsap.to('.blur', { opacity: 0, display: 'none', duration: 0.5, ease: 'elastic' });
    }


  }, [modal])


  async function HandleSubmit(e) {
    e.preventDefault();
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL_Project}/create`,
       { name }, 
       { headers:
         { Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        withCredentials: true,
      });

    console.log(response.data);
    setmodal(false)/*  */
  }


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_Project}/getAllProjects`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        setprojects(response.data); // Handle the data here
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [modal]);

async function openProject(id) {
  try{
    nevigate(`/project` , {state:{projectID: id}})
  } catch (error) {
    console.error("Error :", error);
  }
}

function LogoutFunction() {
  localStorage.setItem('token' , '')
  nevigate('/login')
}


  return (
    <div className='bg-[#686279] w-screen h-screen p-7'>
      <div className='aaa bg-[#FDFDFD] h-full w-full rounded-2xl relative '>
        <h1 className='bg-[black] text-white p-3 text-2xl font-bold  absolute rounded-2xl top-5 left-5 '>Devil.Ai</h1>
        <i onClick={() => { setmodal(true) }} className=" newpr ri-links-line max-sm:text-2xl sm:text-2xl md:text-3xl lg:text-3xl absolute top-5 left-38 cursor-pointer rounded-full p-3 hover:bg-neutral-200 transition-all">New Project</i>
        <button onClick={LogoutFunction} className=' bg-gray-400 absolute right-7 px-3 py-2  rounded-md text-white font-bold cursor-pointer top-6  '>Logout</button>
        <div className='blur hidden opacity-0 fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm  '> </div>
        {modal &&

          <div className=' bg-blue-300 h-[30%] max-sm:w-[90%] sm:w-[60%] md:w-[40%] lg:w-[20%]  rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3' >
            <h1 className='text-[1.3rem] font-bold'>Create a new project</h1>
            <form onSubmit={HandleSubmit} className='flex flex-col gap-3'>
              <input value={name} onChange={(e) => { setName(e.target.value) }} className='py-2 px-3 bg-white rounded-md ' type="text" required placeholder='Project Name ' />
              <div className='flex gap-3 justify-center'>
                <button className='bg-yellow-300 py-2 px-3 rounded-md w-[40] '>Submit</button>
                <button onClick={(e) => { e.preventDefault(), setmodal(false) }} className='bg-red-300 py-2 px-3 rounded-md w-[40] '>Cancel</button>
              </div>
            </form>

          </div>
        }
        <div className='bg-red  h-[100%]  pt-25 flex flex-col'>
          <h1 className='p-5  m-4 flex items-center  bg-amber-300 text-3xl cursor-pointer rounded-md'>All Projects</h1>
          <div className='p-5  m-5 h-full bg-sky-100 overflow-scroll'>
           {
           projects.map((elem , idx )=>{
            return <div key={idx} className='flex justify-between items-center border-b pb-2 pt-3'>

              <p className='font-bold flex flex-col'>{elem.name}<small className='flex gap-3'>Contributer:{elem.users.length} <i className="ri-user-line font-bold"></i></small></p>
              <button onClick={()=>{openProject(elem._id)}} className='bg-blue-300 py-2 px-3 rounded-md text-white cursor-pointer'>Open</button>
            </div>
           })

           }

          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
