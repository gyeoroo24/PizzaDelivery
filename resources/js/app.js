import axios from 'axios';
import moment from 'moment';
import Noty from 'noty';    //used to show message after adding item to cart
import { initAdmin } from './admin'

let cartCounter = document.querySelector('#cartCounter');
let addToCart = document.querySelectorAll('.add-to-cart');  //Selects the add button having class name add-to-cart

function updateCart (pizza) {
    axios.post('/update-cart',pizza).then(res => {
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type : 'success',
            timeout : 1000,
            text: "Item added to cart successfully",
            progressBar : false
            // layout : 'bottomLeft'    --For changing noty's position
            
          }).show();
    }).catch(err => {
        new Noty({
            type : 'error',
            timeout : 1000,
            text: "Something went wrong!",
            progressBar : false
            
          }).show();
    })
}

addToCart.forEach((btn)=>{          //For each button clicked
    btn.addEventListener('click', (e) => {  //event click , we get an event e and we 
        let pizza = JSON.parse(btn.dataset.pizza);  //receive pizza from data-pizza value and as we sent json from home 
                                                    //we convert it to opject here
        updateCart(pizza);  //Send pizza object to cart
    })
})

//Remove alert after X seconds
const alertMsg = document.querySelector('#success-alert');

if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    },2000)
}



//Changing order status


let statuses = document.querySelectorAll('.status_line');   //to get all status classes/li
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);

let time = document.createElement('small');

function updateStatus(order){

    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })  //For not keeping 2 completed together

    let stepCompleted = true;   //first status

    statuses.forEach((status)=> {
        let dataProp = status.dataset.status    //first status is local and 2nd status is data-status in ejs

        if(stepCompleted)
        {
            status.classList.add('step-completed'); //If the step is completed , 
            //then select the current status (local) and add to its classList 
            //step-completed which is manipulated in scss 
        }

        if(dataProp===order.status) //If it is on-going i.e. order-status equals dataprop
        {
            stepCompleted = false;  //this step is not yet completed
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);

            if(status.nextElementSibling)   //If it is not the last status
            {
                status.nextElementSibling.classList.add('current'); //Then make its next element's class as current 
                //and manipulate its color using scss
            }

        }
    })
}

updateStatus(order);

//Socket for client

let socket = io();  //We receive all the methods from io() in socket

//Admin Side Code

initAdmin(socket)

//Join

if(order)   //If there is an order (received above in hiddenInput)
{
    socket.emit('join',`order_${order._id}`)    //emit an event called join<(user-defined)
    //with order_id to the server
    //order_id is for giving unique name to private room
}

//For new orders to be displayed on admin panel without refreshing
let adminAreaPath = window.location.pathname;   //gives path name/url

if(adminAreaPath.includes('admin'))
{
    socket.emit('join','adminRoom');   //No separate room for admins
    //only one room which will be joined with the same function as client's
}

//For orderUpdate --received from server.js

socket.on('orderUpdated',(data)=>{
    const updatedOrder = {...order};    //first receive old order from this file

    updatedOrder.updatedAt = moment().format(); //set its updatedAt time to now
    updatedOrder.status = data.status;  //set its status to the received status

    updateStatus(updatedOrder); //call the updateStatus function from this file
    new Noty({
        type : 'success',
        timeout : 1000,
        text: "Order Updated",
        progressBar : false
        
      }).show();
    //console.log(data)
})