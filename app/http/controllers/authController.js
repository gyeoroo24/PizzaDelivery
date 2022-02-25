const User = require('../../models/user');  //user model
const bcrypt = require('bcrypt');
const passport = require('passport');


function authController()
{
    //This controller returns an object which has methods
    return {

        login(req,res){
            res.render('auth/login');
        },

        postLogin(req,res,next){    //next is for processing further
            passport.authenticate('local',(err,user,info) => {  //info has messages. The callback here is our done function
                if(err)
                {
                    req.flash('error',info.message);
                    return next(err);
                }

                if(!user)
                {
                    req.flash('error',info.message);
                    return res.redirect('/login');
                }

                req.logIn(user,(err)=>{
                    if(err)
                    {
                        req.flash('error',info.message);
                        return next(err);
                    }

                    //if there is no error 
                    res.redirect('/');
                })
            })(req,res,next);   //the function passport.authenticate returns a function which we need to call
            
        },

        register(req,res){
            res.render('auth/register');
        },

        async postRegister(req,res){
            const {name,email,password} = req.body;

            //Validate data

            if(!name || !email || !password)    //If any of them is missing
            {
                req.flash('error','All Fields are required!');  //Used to send flash message only once per error
                //1st parameter is key and 2ns parameter is its value
                //we can access these flash messages in ejs using messages.key-name

                req.flash('name',name); //used to send name and email as it is after refresh
                req.flash('email',email);
               
                return res.redirect('/register');
            }
            //console.log(req.body);

            //Check if Email Already exists

            User.exists({email : email}, (err,result)=>{
                if(result)  //If we have some result , that indicates user already exists
                {
                    req.flash('error','Email already exists!');  
                    req.flash('name',name); 
                    req.flash('email',email);
                
                    return res.redirect('/register');
                }
            })


            //Hashed Password

            const hashedPassword = await bcrypt.hash(password,10);

            //Create a User if everything is OK

            const user = new User({
                // name : name,
                // email : email,

                name,
                email,
                password : hashedPassword
            })

            user.save().then((user)=>{
                //Login
                return res.redirect('/');

            }).catch(err => {
                    req.flash('error','Something went wrong!');  
                                    
                    return res.redirect('/register');
            })
        },
        logout(req,res){
            req.logout();

            return res.redirect('/login');

        }   
    }
}

module.exports = authController;