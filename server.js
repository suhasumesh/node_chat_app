const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
var http = require('http').Server(app); 
const io = require('socket.io')(http)
const Message = require('./models/message');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// app.use('/',(req,res,next)=>{
//     res.sendFile('index.html', { root: __dirname });
// })

// let messages = [{name:"Suhas",message:"Hello World!"},{name:"Vikrant",message:"hello suhas!"}
// ]
app.use(express.static(__dirname));

app.get('/messages',async (req,res,next)=>{
    try{
        const messages = await Message.find();
        res.send(messages);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Some internal error"})
    }
})
app.post('/messages',async (req,res,next)=>{
    var message = new Message(req.body);
    try{
        const mess = await message.save();
        // messages.push(req.body);
        io.emit('message',req.body);
        res.status(200).json({message:"Messages saved successfully"})
    }catch(err){
        console.log(err);
        }
        
    

    //     if(err){
    //         console.log(err);
    //         res.sendStatus(500);
    //     }
    //     messages.push(req.body);
    // io.emit('message',req.body);
    // res.sendStatus(200);
    })
    
// })

io.on("connection",(socket)=>{
    console.log('user connected');
})

mongoose.connect(process.env.MONGO_URL).then(result=>{
    console.log("Connected to MongoDb");
}).catch(err=>{
    console.log(err);
})

var server = http.listen(3001,()=>{
    console.log("Server Listening in port 3001");
})