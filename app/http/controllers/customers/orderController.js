const Order = require('../../../models/order'); 

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
                res.redirect('/');

            }).catch(err => {

                req.flash('error','Something went wrong');
                res.redirect('/cart');

            })
        },

        async index(req,res){
            const orders = await Order.find({customerId : req.user._id});
            //orders contains all the orders of the customerId of the current logged in user in the session
            

            res.render('customers/orders',{orders : orders});

        }
    }
}

module.exports = orderController;