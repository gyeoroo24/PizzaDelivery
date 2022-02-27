//For the purpose that allows only logged In users to go to orders and customer/orders page

function auth(req,res,next){

    //If the user is already authenticated , process further

    if(req.isAuthenticated())
    {
        return next();
    }

    //else redirect to the home page
    return res.redirect('/login');
}

module.exports = auth;