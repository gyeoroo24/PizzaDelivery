function cartController()
{
    //This controller returns an object which has methods
    return {

        index(req,res){
            res.render('customers/cart');
        }        
    }
}

module.exports = cartController;