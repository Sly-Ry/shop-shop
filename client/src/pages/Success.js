import React, { useEffect } from 'react';

import { useMutation } from '@apollo/client';
import Jumbotron from '../components/Jumbotron';
import { ADD_ORDER } from '../utils/mutations';
import { idbPromise } from '../utils/helpers';

function Success() {
    const [addOrder] = useMutation(ADD_ORDER);

    useEffect(() => {
        async function saveOrder() {
            // declare a variable called cart that uses the idbPromise() function to get all of the cart items.
            const cart = await idbPromise('cart', 'get');

            // Then declare a new variable called products that maps the cart items into an array of product IDs.
            const products = cart.map(item => item._id);

            if (products.length) {
                const { data } = await addOrder({ variables: { products } });
                const productData = data.addOrder.products;
                
                // After the mutation executes, you can then delete all of the IDs from the IndexedDB store.
                productData.forEach((item) => {
                  idbPromise('cart', 'delete', item);
                });
            }

            // Redirect the user to the homepage after three seconds
            setTimeout(() => {
                window.location.assign('/');
            }, 3000);
        }
        
        // We've set up an inner saveOrder() function as an async function because we'll need to perform some asynchronous actions like reading from IndexedDB and calling the addOrder() mutation.
        saveOrder();

        // Once you have the product IDs, you can pass them to the addOrder() mutation.
    }, [addOrder]);

    return (
        <div>
            <Jumbotron>
            <h1>Success!</h1>
            <h2>
                Thank you for your purchase!
            </h2>
            <h2>
                You will now be redirected to the homepage
            </h2>
            </Jumbotron>
        </div>
    );
};

export default Success;