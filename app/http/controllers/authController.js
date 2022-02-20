function authController()
{
    //This controller returns an object which has methods
    return {

        login(req,res){
            res.render('auth/login');
        },

        register(req,res){
            res.render('auth/register');
        }

        
    }
}

module.exports = authController;