const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerId : {
        //Refers to customer id of User schema 
        //to refer to the user who placed this order

        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    items : {

        //Refers to the items in the cart in that session

        type : Object,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    paymentType : {
        type : String,
        default : 'COD' //Assuming Cash On Delivery as payment
    },
    status : {
        type : String,
        default : 'order_placed'
    },
},{timestamps : true})

module.exports = mongoose.model('Order',orderSchema);