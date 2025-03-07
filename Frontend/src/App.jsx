import React from 'react'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register';
import { ProtectorWrapper } from './Pages/HomeProtector';
import { LoginProtector } from './Pages/LoginProtector';
import {RegisterProtector} from './Pages/RegProtector'
import ProjectPage from './Pages/ProjectPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element= {
          <ProtectorWrapper>
            <Home/>
          </ProtectorWrapper>
          }/>
        <Route path="/login" element={
          <LoginProtector>
            <Login />
          </LoginProtector>
          } />
        <Route path="/register" element={
          <RegisterProtector>
            <Register />
           </RegisterProtector>
          } />
          <Route path='/project' element={
            <ProjectPage/>
          }/>
      </Routes>
    </Router>
  )
}

export default App
