const Order = require('../../../models/order');


function statusController(){
    return {
        update(req,res){
            Order.updateOne({_id : req.body.orderId} , {status : req.body.status} , (err,data) => {
                if(err)
                {
                   return res.redirect('/admin/orders');
                }

                const eventEmitter = req.app.get('eventEmitter');   //get the eventEmitter

                //emit orderUpdated event with the data to update/flash message to the client
                //Used in server.js
                eventEmitter.emit('orderUpdated', {id : req.body.orderId , status : req.body.status});


                return res.redirect('/admin/orders');
            })
        }
    }
}

module.exports = statusController