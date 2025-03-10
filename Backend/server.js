import { configDotenv } from 'dotenv';
configDotenv();
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken"
import http from 'http';
import app from './app.js';
import UserModel from './Models/userModel.js';
import ProjectModel from './Models/projectModel.js';
import { getResults } from './Services/AiServices.js';
const SECRET_KEY = process.env.JWT_SECRET
const port = process.env.PORT;

const server = http.createServer(app)


app.use(cors({
    origin: "http://localhost:5173", // Allows all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"], // Explicitly define allowed methods
        credentials: true // Allow cookies and authentication headers
    }
});



//   A middleware to check if user is authriozed to connect with Socket.io or not 
io.use((socket, next) => {
    const authHeader = socket.handshake.headers?.authorization;
    const token = socket.handshake.auth?.token || (authHeader && authHeader.split(" ")[1]);
     
    if (!token) {
        return next(new Error("Authentication error"));
    }
    try {
        const decoded = jwt.verify(token , SECRET_KEY);
        socket.user = decoded;
        next()
        
    } catch (error) {
         next(new Error("AUTHENCITATION ERROR : INVALID TOKEN"))
        
    }

})


// Handle socket.io connections
io.on("connection", (socket) => {
    const userID = socket.user?.id;
    console.log(`User ${userID} connected`);
   
    socket.on("joinProject" , (id)=>{
        console.log(`User ${userID} joined project room: ${id}`);
        socket.join(id);

    })

        // Listen for messages from clients
         socket.on("sendMessage", async ({message , id}) => {
             const user = await UserModel.findById(userID);
             const name = user.name;
            const project = await ProjectModel.findById(id);
            project.msgs.push({name ,message});
            await project.save();       

            const isAiInclude = message.includes('@AI');

            if(isAiInclude){
                console.log('Message contains AI request');
                const aiResponse = await getResults({prompt: message});
                // socket.emit("receiveMessage", {name, message: aiResponse, sender: 'AI' });
                socket.broadcast.to(id).emit("receiveMessage", {name:"AIE" , message:aiResponse , sender:'AI' })

                socket.emit("receiveownMessage", {message:aiResponse ,name :'ai'});
            
        
            }

            const sender = 'sender'
       
      
            socket.broadcast.to(id).emit("receiveMessage", {name , message , sender })

            socket.emit("receiveownMessage", {message,name});
        });
        

    // Handle disconnections
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});



server.listen(port, () => console.log(`Server is up on port ${port}`))
