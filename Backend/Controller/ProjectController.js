import { validationResult } from "express-validator"
import { CreateProjectService, getProDetails, gettingallprojects } from "../Services/projectServices.js";
import UserModel from "../Models/userModel.js";
import ProjectModel from "../Models/projectModel.js";
import mongoose from "mongoose";

const createProjectController = async (req ,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
   try {
    const user_ID = req.user.id;
    const {name} = req.body;
    
    
    const Project = await CreateProjectService({name , user_ID});
    res.json(Project);
    
   } catch (error) {
   
    res.status(500).json({
        message: error.message,  // Includes the stack trace in the response for detailed debugging
    })
   
    
}}

const getallProjects = async (req , res) => {

    const LogedinUser = await UserModel.findById(req.user.id);
    if(!LogedinUser){
        return res.status(404).json({ msg: 'User not found' });
    }
    const _id = LogedinUser._id;
    try {
        const projects = await gettingallprojects(_id)
        res.json(projects);
    
   } catch (error) {

    res.status(500).json({
        message: error.message,  // Includes the stack trace in the response for detailed debugging
    })
    
}
}

const getProjectDetails = async (req , res)=>{
 const {id} = req.params
try {
    const projdetail= await getProDetails(id)
    res.json(projdetail)


} catch (error) {
    res.status(500).json({
        message: error.message,  // Includes the stack trace in the response for detailed debugging
    })
    
}
}

const addContributer = async (req , res) => {
    const {projectID , addedUsers} = req.body; 
    try {
      
        const project = await ProjectModel.findByIdAndUpdate(
            projectID,
            { $addToSet: { users: { $each: addedUsers.map(id => new mongoose.Types.ObjectId(id)) } } }, 
            { new: true }
        ).populate('users', 'name email'); // Populate user details
        
      

    
   } catch (error) {
    res.status(500).json({
        message: error.message,  // Includes the stack trace in the response for detailed debugging
    })
    
}
}

const allmsgs = async(req , res )=>{
    const projectID = req.params.id; // Assuming projectID is passed in the URL params
   console.log(projectID)
    try {
        const project = await ProjectModel.findById(projectID)
        res.json(project.msgs)
    } catch (error) {
        res.status(500).json({
            message: error.message,  // Includes the stack trace in the response for detailed debugging
        })
    }


}

export {createProjectController , addContributer, getallProjects , getProjectDetails , allmsgs}