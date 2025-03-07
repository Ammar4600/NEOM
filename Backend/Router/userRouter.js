import express from 'express'
import { getProfile, getusers, loginUser, logoutUser, registerUser } from '../Controller/userController.js'

import { CheckLoginValadation, CheckRegValadation } from '../Middlewares/ValaditionMiddlewares.js'
import { authCheck } from '../Middlewares/AuthMiddlewares.js'





const userRoutes = express()

userRoutes.post('/register', CheckRegValadation, registerUser)

userRoutes.post('/login' , CheckLoginValadation,  loginUser)

userRoutes.get('/getprofile', authCheck , getProfile)


userRoutes.get('/logout' , logoutUser)

userRoutes.get('/getallusers', authCheck, getusers)



export default userRoutes