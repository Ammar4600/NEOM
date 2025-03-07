import { configDotenv } from 'dotenv';
configDotenv();
import mongoose, { model } from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'; 


const UserModelSchema = mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        trim:true,
        select:false,
    }

}
);

     UserModelSchema.pre('save' , async function(next){
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password , 12)
        }
        next()
     })

     UserModelSchema.methods.generateToken = async function () {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      };
      



     const UserModel = mongoose.model('user', UserModelSchema);

     export default UserModel; 
