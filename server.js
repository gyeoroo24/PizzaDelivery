require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDBStore = require('connect-mongo');
const passport = require('passport');
const Emitter = require('events');  //for emitting event for socket.io in statusController

//Database Connection

const url = 'mongodb://localhost/pizza';

mongoose.connect(url , {useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
 connection.once('open', function() {
   // we're connected!
   console.log("DATABASE CONNECTION OPENED!!");
});



//Session Store

//Event Emitter

const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter);   //To bind with our app so that  we can use it elsewhere with the name eventEmitter

//Session Config

app.use(session({
    secret : process.env.COOKIE_SECRET, //COOKIE_SECRET is defined in .env
    resave : false,
    store : MongoDBStore.create({          //Is either a constructor or a class object.
        mongoUrl : url,
        collectionName : 'sessions' //Stores the sessions in sessions table in Database
    }),                         //For storage in Database (default is memory)
    saveUninitialized : false,
    cookie : { maxAge : 1000 * 60 * 60 * 24}    //24 hrs
}))

//Passport --Used for login


const passportInit = require('./app/config/passport');
passportInit(passport);     //Passing passport to config's passport.js
app.use(passport.initialize());
app.use(passport.session());



//Express-Flash

app.use(flash());

//set Template Engine------Make sure that it is always above routes as we
//inject the body in the layout.ejs file
app.use(expressLayout);

app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

//Assets ----using static middleware to apply css

app.use(express.static('public'));

app.use(express.urlencoded({extended:false}));  //Use to receive data other than json like in register

app.use(express.json());    //To use default as json in terminal so that it doesn't give undefined object
//Calling function initRoutes from web.js

//Global Middleware --used to access session object everywhere(even in layout.ejs)

app.use((req,res,next)=>{
    res.locals.session = req.session,
    res.locals.user = req.user,
    next()  //Used to proceed for next work.If we don't call this , then it will keep buferring
    //and won't move forward
})


require('./routes/web')(app);


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT , () => {
    console.log(`Listening on port  ${PORT}`);
})

// Socket -Server Side -------->In order to use this socket on client side , we connect js file 
//of socket io in layout.ejs and in app.js , we write the client side conde for this socket
//We use the concept of private rooms having unique name/id as our order_id so that 
//we can render/update on each order 

//Socket IO
const io = require('socket.io')(server)
io.on('connection',(socket)=>{  //we receive a socket on connection
    //Join

    //console.log(socket.id); //This is socket's unique id

    socket.on('join' , (orderId) => {   //on event join from client
        //console.log(orderId);   //orderId received from client on emitting join event

        socket.join(orderId);   //This is socket's join method and not join event from client
        //we are joining the unique orderId as private room id
    })

})

//From statusController

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data);

    //io.to means in the private room having id as data.id which is our orderId
    //emit the status orderUpdated with the same data that we receive
})

//From customers/orderController

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data);
})