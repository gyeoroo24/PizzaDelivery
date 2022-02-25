const LocalStrategy = require('passport-local').Strategy;   //It is a class having strategy as passport-local
const User = require('../models/user');
const bcrypt = require('bcrypt');
function init(passport){    //getting passport from server.js

    passport.use(new LocalStrategy({usernameField : 'email'},async (email,password,done) => {
        //Login
        //Check if User exists
        
        const user = await User.findOne({email : email});

        if(!user)
        {
            return done(null,false, {message : 'No User with this email'});
        }

        bcrypt.compare(password,user.password).then(match => {  //match is true or false
            if(match)
            {
                return done(null,user, {message : 'Logged in successfully'});
                //return user if logged in successfully so user instead of false
            }
            else{
                return done(null,false, {message : 'Wrong userid or password'});
            }
        }).catch(err => {
            return done(null,false, {message : 'Something went Wrong!'});
        })
    }))

    //Serialize user allows us to store user and done(here) allows us to store it via _id.
    //The first parameter in done is error
    passport.serializeUser((user,done)=>{
        done(null,user._id);    
    })

    //deserialize allows us to get user stored previously (which is logged in)
    passport.deserializeUser((id,done)=>{
        User.findById(id, (err,user) => {   //finds the user with provided id and gets that particular user
            done(err,user);
        })
            
    })
}

module.exports = init;