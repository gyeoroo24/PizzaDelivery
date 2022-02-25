function cartController()
{
    //This controller returns an object which has methods
    return {

        index(req,res){
            res.render('customers/cart');
        },
        
        update(req,res)
        {
            //If there is no cart in a session , then create an empty cart and store it in session
            if(!req.session.cart)
            {
                req.session.cart = {
                    items : {},
                    totalQty : 0,
                    totalPrice : 0
                }
            }

            let cart = req.session.cart;
            // console.log(req.body);

            //If the cart doesn't already have that particular item , then add it to the cart
            //as an object in items and increment the totalQty and totalPrice of the cart
            if(!cart.items[req.body._id])
            {
                cart.items[req.body._id] = {
                    item : req.body,
                    qty:1
                }

                cart.totalQty +=1,
                cart.totalPrice += req.body.price
            } //If the item already exists in the cart , simply increment its qty and increment
            //cart's totalQty and totalPrice
            else{
                cart.items[req.body._id].qty +=1,
                cart.totalQty+=1,
                cart.totalPrice += req.body.price
            }

            return res.json({totalQty : req.session.cart.totalQty});
        }
    }
}

module.exports = cartController;