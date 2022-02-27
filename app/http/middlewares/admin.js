function admin(req,res,next){

    //If the user is already authenticated and the role is admin, process further

    if(req.isAuthenticated() && req.user.role === 'admin')
    {
        return next();
    }

    //else redirect to the home page
    return res.redirect('/');
}

module.exports = admin;