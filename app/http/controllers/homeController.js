//We require controllers to execute certain logic for e.g. post request's response and stuff
//Now since we do not wish to mess up our server.js file we divided it into routes and the 
//routes inturn call controllers

//The controllers make use of factory-methods

const Menu = require('../../models/menu');

function homeController()
{
    //This controller returns an object which has methods
    return {

        //Approach - 1 
        
        /*
        index(req,res){
            Menu.find().then((pizzas) => {  //finds all the items and stores it in pizzas
                console.log(pizzas);
                res.render('home',{pizzas:pizzas}); //sends pizzas to home page
            })
            

        }

        */
        async index(req,res){
            const pizzas = await Menu.find() 
            console.log(pizzas);
            res.render('home',{pizzas:pizzas}); //sends pizzas to home page
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