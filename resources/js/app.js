import axios from 'axios';
import Noty from 'noty';    //used to show message after adding item to cart

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