import express from 'express';
import { authCheck } from '../Middlewares/AuthMiddlewares.js';
import { addContributer, allmsgs, createProjectController, getallProjects, getProjectDetails } from '../Controller/ProjectController.js';
import { checkProjectValadation } from '../Middlewares/ValaditionMiddlewares.js';
const ProjRouter = express();



ProjRouter.post('/create',
    checkProjectValadation, 
    authCheck, 
    createProjectController)
ProjRouter.post("/addUserToProject", authCheck , addContributer)
ProjRouter.get('/getAllProjects' , authCheck , getallProjects)
ProjRouter.get('/getProjectById/:id' , authCheck , getProjectDetails)
ProjRouter.get("/getallmsgs/:id"  , allmsgs )

export default ProjRouter