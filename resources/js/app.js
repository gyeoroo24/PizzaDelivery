import axios from 'axios';

let addToCart = document.querySelectorAll('.add-to-cart');  //Selects the add button having class name add-to-cart

function updateCart (pizza) {
    axios.post('/update-cart',pizza).then(res => {
        console.log(res);
    })
}

addToCart.forEach((btn)=>{          //For each button clicked
    btn.addEventListener('click', (e) => {  //event click , we get an event e and we 
        let pizza = JSON.parse(btn.dataset.pizza);  //receive pizza from data-pizza value and as we sent json from home 
                                                    //we convert it to opject here
        updateCart(pizza);  //Send pizza object to cart
    })
})