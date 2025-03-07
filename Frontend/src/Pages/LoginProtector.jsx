import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginProtector = ({children})=>{
 const nevigate = useNavigate();
 const token = localStorage.getItem('token');
 useEffect(()=>{
   if(token){
     nevigate('/')
     return;
   }
 },[token , nevigate])

 return children;
 

}