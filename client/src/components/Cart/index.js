import React from 'react';
import CartItem from '../CartItem';
// We imported the Auth module to conditionally render the checkout button in the JSX.
import Auth from '../../utils/auth';

import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART } from '../../utils/actions';

import './style.css';

const Cart = () => {
  // You'll use the custom useStoreContext Hook to establish a state variable and the dispatch() function to update the state. In this case, dispatch() will call the TOGGLE_CART action
  const [state, dispatch] = useStoreContext();

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  };

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

  return (
    <div className="cart">
      {/* This handler will toggle the cartOpen value whenever the [close] text is clicked */}
      <div className="close" onClick={toggleCart}>[close]</div>
      <h2>Shopping Cart</h2>
      <div>
          <CartItem item={{name:'Camera', image:'camera.jpg', price:5, purchaseQuantity:3}} />
          <CartItem item={{name:'Soap', image:'soap.jpg', price:6, purchaseQuantity:4}} />

          <div className="flex-row space-between">
            <strong>Total: $0</strong>
            {
              Auth.loggedIn() ?
                <button>
                  Checkout
                </button>
                :
                <span>(log in to check out)</span>
            }
          </div>
        </div>
    </div>
  );
};

export default Cart;