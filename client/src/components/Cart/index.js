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

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
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
                <button>
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