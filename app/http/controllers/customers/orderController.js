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

                req.flash('success','Order placed successfully');
                delete req.session.cart;
                res.redirect('/customer/orders');

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

        }
    }
}

module.exports = orderController;