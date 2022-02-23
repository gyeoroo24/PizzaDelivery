function cartController()
{
    //This controller returns an object which has methods
    return {

        index(req,res){
            res.render('customers/cart');
        },
        
        update(req,res)
        {
            return res.json({data : 'All is well!'});
        }
    }
}

module.exports = cartController;