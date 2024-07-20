const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser =require('cookie-parser');
const {initSocket} = require('./webSocket');

// routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userOp');
const messagesRoutes = require('./routes/messages');

app.use(express.json());
app.use(cookieParser());

app.use(cors( {
    credentials:true,
    origin:'*'
}));

app.use('/auth',authRoutes);
app.use('/userOp',userRoutes);
app.use('/messages',messagesRoutes);

// get messages for a spicifc user

app.use((error, req, res, next) =>{
    const status = error?.status || 500;
    const message = error?.message|| 'an error occured';
    res.status(status).json({ message: message });
});

// connect to the database and then listen for incomming requests
mongoose.connect('mongodb+srv://alaa:<alaa>@cluster0.grgltyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(async result=> {
    let server = app.listen(8080);
    initSocket(server);
    console.log("server started");
}).catch(err=>console.log(err));