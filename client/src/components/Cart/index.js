import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import CartItem from '../CartItem';
// We imported the Auth module to conditionally render the checkout button in the JSX.
import Auth from '../../utils/auth';

import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import { QUERY_CHECKOUT } from '../../utils/queries';

import { loadStripe } from '@stripe/stripe-js';

import './style.css';

// This is the same API key that we used in the plain HTML test, but now we're using it in the context of React. 
// We'll use this stripePromise object to perform the checkout redirect.
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
  // You'll use the custom useStoreContext Hook to establish a state variable and the dispatch() function to update the state. In this case, dispatch() will call the TOGGLE_CART action
  const [state, dispatch] = useStoreContext();

  // The data variable will contain the checkout session, but only after the query is called with the getCheckout() function.
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
  
  //  function to check if there's anything in the state's cart property on load.
  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      // We dispatch the ADD_MULTIPLE_TO_CART action here because we have an array of items returning from IndexedDB, even if it's just one product saved. This way we can just dump all of the products into the global state object at once instead of doing it one by one
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    };

    // we're checking to see if state.cart.length is 0, then executing getCart() to retrieve the items from the cart object store and save it to the global state object.
    if(!state.cart.length) {
      getCart();
    }
    // if we neglect to pass the state.cart.length value into useEffect()'s dependency array, this useEffect() function would just continuously run if there's nothing to retrieve from the cached object store and state.cart.length is still 0.
    // That's the whole point of the dependency array. We list all of the data that this useEffect() Hook is dependent on to execute. The Hook runs on load no matter what, but then it only runs again if any value in the dependency array has changed since the last time it ran.
  }, [state.cart.length, dispatch]);

  // A second useEffect() Hook specifically for Stripe.
  // useEffect Hook to watch for changes to data. We'll use the stripePromise object to redirect to Stripe once the data variable has data in it.
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  };

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }
  // When the user clicks Checkout, this function will loop over the items saved in state.cart and add their IDs to a new productIds array. 
  function submitCheckout() {
    // This productIds array is what the QUERY_CHECKOUT query would need to generate the Stripe session.
    const productIds = [];
  
    state.cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds }
    });
  }

  // If cartOpen is false, the component will return a much smaller <div>. 
  if (!state.cartOpen) {
    return (
      // Clicking this <div>, however, will set cartOpen to true and return the expanded shopping cart.
      <div className="cart-closed" onClick={toggleCart}>
        {/* You should always wrap emojis (like the shopping cart icon) in a <span> element that includes role and aria-label attributes. Doing so will help screen readers understand the context of the emoji. */}
        <span
          role="img"
          aria-label="trash">🛒</span>
      </div>
    );
  }

  console.log(state);

  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>[close]</div>
      <h2>Shopping Cart</h2>
      {state.cart.length ? (
        <div>
          {/* The items on state.cart are mapped into a series of <CartItem /> components. */}
          {state.cart.map(item => (
            <CartItem key={item._id} item={item} />
          ))}
          <div className="flex-row space-between">
            {/* The calculateTotal() function is called inside of the <strong> element to display the total amount.  */}
            <strong>Total: ${calculateTotal()}</strong>
            {
              Auth.loggedIn() ?
                <button onClick={submitCheckout}>
                  Checkout
                </button>
                :
                <span>(log in to check out)</span>
            }
          </div>
        </div>
      ) : (
        // We've also wrapped the main shopping cart content in a ternary expression to display a different message if state.cart.length is zero.
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;