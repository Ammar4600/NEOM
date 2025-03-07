import mongoose, { model } from 'mongoose';
import { type } from 'os';

const ProjectModelSchema = mongoose.Schema(
 {
    name:{
        type:String,
        required:true,
        unique:true,
        minlength:3,
        maxlength:50,
        trim:true,
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
   msgs :{
    type : Array,
    default : []
   }


}
);

const ProjectModel = model('project' , ProjectModelSchema)

export default ProjectModel