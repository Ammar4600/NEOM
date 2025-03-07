import ProjectModel from "../Models/projectModel.js";
import UserModel from "../Models/userModel.js";

const CreateProjectService = async ({name , user_ID}) => {
    if (!name) {
        throw new Error('Name is required');
    }
    if(!user_ID){
        throw new Error('User ID is required');
    }

    try {
        const project = await ProjectModel.create({
            name,
            users: [user_ID],
        })
        return project;
        
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create project');
    }

    
}

const gettingallprojects = async (userId) => {
    const  projects = await ProjectModel.find({ users: userId,})
    if(!projects){
        throw new Error('No projects found');
    }

    return projects;
    
}

const getProDetails = async (id) => {
    const project = await ProjectModel.findById(id);
    const userIds = project.users.map(id => id); 
    const users = await UserModel.find({ _id: { $in: userIds }});
    
    if(!project){
        throw new Error('Project not found');
    }
    return {project,  users};
}
export {CreateProjectService , gettingallprojects , getProDetails}