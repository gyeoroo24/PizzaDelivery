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

//Express-Flash

app.use(flash());

//set Template Engine------Make sure that it is always above routes as we
//inject the body in the layout.ejs file
app.use(expressLayout);

app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

//Assets ----using static middleware to apply css
app.use(express.static('public'));

//Calling function initRoutes from web.js

require('./routes/web')(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT , () => {
    console.log(`Listening on port  ${PORT}`);
})