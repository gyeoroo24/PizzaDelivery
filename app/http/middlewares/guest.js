function guest(req,res,next){

    //If the user is not already authenticated , process further

    if(!req.isAuthenticated())
    {
        return next();
    }

    //else redirect to the home page
    return res.redirect('/');
}

module.exports = guest;