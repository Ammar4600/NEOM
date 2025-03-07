import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { UserProvider } from './Context/userContext';
import 'remixicon/fonts/remixicon.css'

createRoot(document.getElementById('root')).render(
  
<UserProvider>
    <App />
   </UserProvider>    

)
