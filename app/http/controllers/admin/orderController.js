const order = require('../../../models/order');
const Order = require('../../../models/order');

function orderController() {
    return {
        index(req,res){
            order.find({status : {$ne : 'completed'}} ,  //Fetch those orders that are not yet completed
            null ,
            {sort : {'createdAt' : -1}}).populate    //Sort them according to descending order
            ('customerId','-password').exec( (err , orders ) => {

                if(req.xhr) //If there is an xhr request , then send orders as json
                {
                    return res.json(orders);
                }
                else{
                    return res.render('admin/orders');
                }
                
            })

            //The populate method gets us all the customers(as we have kem customerId as a reference for customers)
            //and since we don't need customer's password , we subtract it.
            //exec method is used to execute this and returns a callback with err and success item
            //On success , we render the orders on the admin page
        }
    }
}

module.exports = orderController;