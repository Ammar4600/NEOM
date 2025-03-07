import { validationResult } from "express-validator"
import { CreateUser } from "../Services/userServices.js";
import UserModel from "../Models/userModel.js";
import bcrypt from 'bcryptjs';
import redisClient from "../Services/redisServices.js";


const registerUser = async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {name , email , password} = req.body;
        const user = await CreateUser({name , email , password});
        const token = await user.generateToken();
        res.cookie('token' , token);
        res.json({ user, token });
        
    } catch (error) {

        console.error(error.message);
        res.status(500).send('Server Error');    
    }
  
}





const loginUser = async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {name , email , password} = req.body;
        const user = await UserModel.findOne({email}).select('+password');
        if(!user){
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        
        if(isMatch){
            const token = await user.generateToken();
            res.cookie('token' , token);
            res.json({ user, token });
        }
        else{
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');   
      }
        
    }





    const logoutUser = async (req , res) => {

      try {
        const token = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : req.cookies.token;
        
        if (!token) {
            return res.status(400).json({ msg: 'No token provided' });
        }

        // Store the token in Redis to invalidate it
        await redisClient.set(token, 'invalid', 'EX', 86400);

        res.clearCookie('token');
        res.status(200).json({ msg: 'Logged out successfully' });

      } catch (error) {

        console.error(error.message);
        
      }
}








const getProfile= async (req , res) => {
    const userId = req.user.id;
    const user = await UserModel.findById(req.user.id);
  
    if(!user){
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user); 
}

const getusers = async (req , res) => {
    const users = await UserModel.find();
    res.json(users);
}

export {registerUser , loginUser , logoutUser , getProfile , getusers};