//We require controllers to execute certain logic for e.g. post request's response and stuff
//Now since we do not wish to mess up our server.js file we divided it into routes and the 
//routes inturn call controllers

//The controllers make use of factory-methods

function homeController()
{
    //This controller returns an object which has methods
    return {
        index(req,res){
            res.render('home');
        }

        //above can also be written as 
        /*
            index : function() {

            }

            where index is key and has a method
        */

            //The homeController is a module which returns an object having methods
            //SO , we call this in our routes and there in app.get( , ) - the 2nd parameter 
            //is an unknown function so there we call this and it receives req,res by default
    }
}

module.exports = homeController;