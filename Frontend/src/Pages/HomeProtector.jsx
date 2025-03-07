import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProtectorWrapper = ({children}) => {
const nevigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(()=>{
        if(!token){
            nevigate('/login')
            return;
        } 
    },[token ])
    
    return children;

}