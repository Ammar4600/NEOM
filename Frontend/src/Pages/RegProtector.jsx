import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterProtector = ({children})=>{
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(()=>{
        if(token){
            navigate('/')
            return
        }
    },[ navigate , token])

    return children;
   
}