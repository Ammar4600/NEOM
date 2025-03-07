import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { socket } from '../Config/socket.js';
import { UserContext } from '../Context/userContext.jsx';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function ProjectPage() {
  const [projectDetail, setProjectDetail] = useState("");
  const [users, setusers] = useState([]);
  const location = useLocation();
  const id = location.state.projectID;
  const [slideopen, setSlideOpen] = useState(false);
  const [modalopen, setmodalopen] = useState(false);
  const [allusers, setallusers] = useState([]);
  const [addedUsers, setaddedUsers] = useState([]);
  const nevigate = useNavigate()
  

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL_Project}/getProjectById/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }, { withCredentials: true })

        setProjectDetail(response.data.project);
        setusers(response.data.users);
      } catch (error) {
        console.error("Error fetching project details:", error);

      }
    }
    fetchProjectDetails();

  }, [addedUsers, slideopen, modalopen])

  useEffect(() => {
    const fetchallUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/getallusers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            withCredentials: true,
          },
        })
        setallusers(response.data);

      } catch (error) {
        console.error("Error fetching users:", error);

      }
    }
    fetchallUsers();

  }, [])

  const handleAddUser = (userID) => {
    const alreadyExist = addedUsers.includes(userID);

    if (alreadyExist) {
      setaddedUsers(addedUsers.filter((elem) => elem !== userID));
      setfill(false)
    } else {
      setaddedUsers([...addedUsers, userID]);
      setfill(true)
    }

  };

  async function adduserFun() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL_Project}/addUserToProject`,
        {
          projectID: id,  // Fix key name
          addedUsers,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            withCredentials: true,
          },
        })
      alert('Users added successfully');
      setaddedUsers([]);
      setmodalopen(false);


    } catch (error) {
      console.error("Error adding users:", error);
    }

  }

  //  Chat application start here
  // socket Connect to backend
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([{}])

  // Get all msgs from backend only on refresh/
  useEffect(() => {
    async function getmsgs() {
      // fetch all messages from backend
      try {

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_Project}/getallmsgs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              withCredentials: true,
            },

          },
        )

        setMessages(response.data)
        console.log(response.data)

      } catch (error) {

        console.error("Error fetching messages:", error);

      }



    }
    getmsgs()
  }, [])


  useEffect(() => {
    socket.on("connect", () => {
    });

    // creating room
    socket.emit("joinProject", id);

    // LISTENT FOR INCOMING MESSAGES
    socket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);

    });


    socket.on("receiveownMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);

    });

    return () => {
      socket.off("receiveMessage");
      socket.off("receiveownMessage");
    };
  }, [])


  function sendMessage() {

    if (message === "") return;
    socket.emit("sendMessage", { message, id });
    setMessage("");
  }
  function handleKeyPress(e) {
    if (e.key == 'Enter') {
      sendMessage()
    }
  }
  function LogoutFunction() {
    localStorage.setItem('token' , '')
    nevigate('/login')
  }
  console.log(messages)
  return (
    <div className='main  h-screen w-full  bg-[#018269] relative overflow-hidden '>
      <div className="chatSection relative ` h-full flex flex-col  sm:w-[100%] md:w-[40%] lg:w-[26%] bg-black ">
        <div className="head h-[8%] bg-[#FFFFFF]  p-4 text-xl flex items-center justify-between  ">
          <small className='font-bold'>{projectDetail.name}</small>
          <div className='flex gap-5'>
            <i onClick={() => setmodalopen(true)} className="ri-add-line cursor-pointer transition-all duration-200 hover:bg-[#f3bdbd2f] rounded-md p-3"></i>
            <i onClick={() => setSlideOpen(true)} className="ri-group-fill cursor-pointer transition-all duration-200 hover:bg-[#f3bdbd2f] rounded-md p-3"></i>
          </div>
        </div>


        <div className="messagebox bg-[#F4F2E9] flex flex-col grow p-2 overflow-y-auto  overflow-scroll">
          {
            messages.map((msg, idx) => {
              if (msg.name == 'ai') {
                return
              }
              if (msg.sender) {
                return (
                  <div key={idx} className={`  incomming bg-[white] max-w-[100%]  w-fit h-fit m-2 p-2 rounded-md`}>
                    <small className='font-bold'>{msg.name ? msg.name : msg.sender}</small>
                    <p>{msg.message}</p>
                  </div>
                )



              } else {
                return (
                  <div key={idx} className="outgoing bg-[white] max-w-[100%] w-fit ml-auto  h-fit m-2 p-2 rounded-md">
                    <small className='font-bold'>{msg.name}</small>
                    <p>{msg.message}</p>
                  </div>
                )
              }
            })


          }
          {messages.map((msg, idx) =>
            msg.name === 'ai' && (
              <div
                key={idx}
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none leading-relaxed text-gray-800 whitespace-pre-wrap bg-white p-2 rounded-md m-3 w-fit h-fit"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {msg.message}
                </ReactMarkdown>
              </div>
            )
          )}

        </div>


        <div className="send h-[8%] p-2 flex w-full bg-[#ffffff] gap-5 items-center">
          <input onKeyDown={handleKeyPress} value={message} onChange={(e) => { setMessage(e.target.value) }} className='bg-[#361b1a9d] text-white rounded-4xl px-5 py-3 w-[78%]' type="text" placeholder='Message goes here' />
          <i onClick={sendMessage} className="ri-send-plane-line p-2 font-bold text-2xl rounded-full "></i>
        </div>
        <div className={`SideSlide z-40 absolute bg-[#f0f0f3] w-[100%] h-full transition-all duration-400  ${slideopen ? 'translate-x-[0%]' : 'translate-x-[-100%]'} `}>
          <div className="head head flex [8%] bg-[#FFFFFF] p-4 text-xl">
            <i onClick={() => setSlideOpen(false)} className="ri-close-fill   ml-auto cursor-pointer"></i>
          </div>
          <div className="users bg-[#F4F2E9] h-[80%] overflow-scroll p-4 flex flex-col gap-5">
            <small className='  text-xl font-bold'>Contributers</small>
            {
              users.map((elem, idx) => {
                return <div key={idx} className="user flex gap-3 items-center border-b-1 pb-4 border-[#e2c0c0bb]">
                  <img className='rounded-full w-[30px] h-[30px]' src='https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwwfHwwfHx8MA%3D%3D' alt="user" />
                  <small className='font-bold'>{elem.name}</small>
                </div>
              })
            }

          </div>
          <p className='m-auto w-fit'>Powered by AmmarTechnologies</p>
        </div>
      </div>
      <div className={`add_pop_up ${modalopen ? 'flex' : "hidden"}  absolute z-20  justify-center items-center top-0 h-full w-full bg-[#cedce2b2]`}>
        <div className="box bg-white h-[50%]  lg:w-[34%] flex flex-col p-5 rounded-md">
          <div className='flex justify-between border-b-2 border-[#a5969650] p-4 '>
            <h1 className='font-bold text-xl  '>Add Contributers</h1>
            <i onClick={() => { setmodalopen(false) }} className="ri-close-line font-bold text-xl cursor-pointer"></i>
          </div>
          <div className='flex flex-col bg-[#e6f0ee1e] rounded-md p-2 gap-3 my-2 overflow-scroll grow'>
            {
              allusers.map((elem, idx) => {
                return <h2 key={idx} onClick={() => { handleAddUser(elem._id) }} className={`  cursor-pointer text-black border-b-2 border-[#ebdfdfd5] p-3 '} `}>{elem.name}</h2>

              })
            }

          </div>
          <button onClick={() => { setmodalopen(false), adduserFun() }} className='bg-[skyblue] p-3 cursor-pointer font-black  rounded-md'>Add Contributer</button>

        </div>
      </div>
      <div className="ai-response-container absolute z-10 top-[2%] 
    md:left-[44%] lg:left-[28%] h-[88%] md:w-[40%] lg:w-[70%] 
    bg-red overflow-y-auto flex flex-col hidden md:block lg:block ">
        {/* Instruction for AI response usage */}
        <p className="text-black  bg-white p-2 rounded-md w-full font-bold text-xl">
          To get an AI response, include <span className="text-blue-500">@AI</span> before your prompt.
        </p>

        {/* AI Response Box */}
        <div className="response-box m-3 p-4 rounded-lg bg-white shadow-md flex flex-col space-y-4 overflow-y-scroll">
          {messages.map((msg, idx) =>
            msg.name === 'ai' && (
              <div
                key={idx}
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none leading-relaxed text-gray-800 whitespace-pre-wrap"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {msg.message}
                </ReactMarkdown>
              </div>
            )
          )}
        </div>

      </div>
        <button onClick={LogoutFunction} className=' btna bg-gray-400 absolute right-9 px-3 py-2  rounded-md text-white font-bold cursor-pointer top-4.5 z-30  '>Logout</button>

    </div>
  )
}

export default ProjectPage
