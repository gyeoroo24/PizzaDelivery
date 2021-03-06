const Order = require('../../../models/order'); 
const moment = require('moment');
function orderController() {
    return {
        store(req,res){
            const {phone,address} = req.body;

            //Validate request

            if(!phone || !address)
            {
                req.flash('error','All fields are required');

                return res.redirect('/cart');
            }

            const order = new Order({
                customerId : req.user._id,
                items : req.session.cart.items,
                phone,
                address
            })

            order.save().then(result => {
                //This allows us to receive name from result
                //and we can use it in our admin.js whenever new order is found , it can be flashed
                Order.populate(result , {path : 'customerId'} , (err,placedOrder) => {

                    req.flash('success','Order placed successfully');
                    
                    //Emit an event to the admin when an order is placed
                    const eventEmitter = req.app.get('eventEmitter');   //get the eventEmitter

                    //emit orderPlaced event with the result obtained to update/flash message to the admin
                    //Used in server.js
                    eventEmitter.emit('orderPlaced', result);

                    delete req.session.cart;

                    
                    res.redirect('/customer/orders');


                }); 

                

            }).catch(err => {

                req.flash('error','Something went wrong');
                res.redirect('/cart');

            })
        },

        async index(req,res){
            const orders = await Order.find({customerId : req.user._id},
                null,
                {sort : {'createdAt' : -1}});   //sort according to createdAt and -1 is for descending order
            //orders contains all the orders of the customerId of the current logged in user in the session
            
            //To avoid popping up alert (Order - placed successfully) again after back and forward in browser
            res.header('Cache-Control', 'no-cache, private , no-store , must-revalidate ,max-stale = 0 , post-check=0 , pre-check=0')
            
            res.render('customers/orders',{orders : orders , moment : moment});

        },

        async show(req,res) {
            const order = await Order.findById(req.params.id)    //id from web.js route and since we are getting it , we use req.param

            //If the user ic authorized , then show order status else don't

            if(req.user._id.toString() === order.customerId.toString()) //since both are objects , we need to convert them to string to compare them
            {
                return res.render('customers/singleOrder',{order})   //Pass order to the view
            }

            return res.redirect('/')
        }
    }
}

module.exports = orderController;