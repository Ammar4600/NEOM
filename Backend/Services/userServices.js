import UserModel from "../Models/userModel.js"


const CreateUser = async ({name , email , password}) => {
    try {
        const user = await UserModel.create({
            name,
            email,
            password,
        })
        return user;
        
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create user');
    }
}


export {CreateUser}