import { reducer } from '../utils/reducers';
// import our actions
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from '../utils/actions';

// create a sample of what our global state will look like
const initialState = {
    products: [],
    categories: [{ name:'Food'}],
    currentCategory: '1',
    cart: [
        {
            _id: '1',
            name: 'Soup',
            purchaseQuantity: 1
        },
        {
            _id: '2',
            name: 'Bread',
            purchaseQuantity: 2
        }
    ],
    cartOpen: false
};

// First, we'll write a test for updating that products list. This mean's we'll be testing the UPDATE_PRODUCTS action to see if we can add a product to the products array. 
test('UPDATE_PRODUCTS', () => {
    // This function accepts the following two parameters:
    // 1. The current state object, so we can make our copy of it for the new state.
    // 2. The action we're performing to update state, which is broken into the following two parts as an object:
        // 1. type: This is the type of action we're performing, and should be one of the predefined actions we created earlier.

        // 2. value: This won't always have the name value, but it is a name representative of the new data we want to use with the action.
    
    // We pass in the current state held in initialState and then our action, indicating that we want to update our products list with the contents held in the products array.
    let newState = reducer(initialState, {
        type: UPDATE_PRODUCTS,
        // the idea is to see if we are adding anything to the array and nothing specific.
        products: [{}, {}]
    });
    // The expect() functions we run afterwards will help us confirm that we successfully added our products to the newState and didn't affect initialState in any way, shape, or form.
    expect(newState.products.length).toBe(2);
    expect(initialState.products.length).toBe(0);
});

// This one is very similar to UPDATE_PRODUCTS, but it will be used to test how we can update the categories array
test('UPDATE_CATEGORIES', () => {
    // This time, when we execute the reducer() function, we still pass in the initialState, but now our action type and value will change.
    let newState = reducer(initialState, {
        type: UPDATE_CATEGORIES,
        categories: [{}, {}]
    });
    // The result of the reducer() should show that the length of our updated categories array will be 2, while the initial categories array should still be 1. This indicates that we didn't affect our original state values at all and simply used it to create a new version of it.
    expect(newState.categories.length).toBe(2);
    expect(initialState.categories.length).toBe(1);
});

// With this test, we are updating the state of currentCategory to a new string value instead of an array.
test('UPDATE_CURRENT_CATEGORY', () => {
    let newState = reducer(initialState, {
        type: UPDATE_CURRENT_CATEGORY,
        currentCategory: '2'
    });
  
    expect(newState.currentCategory).toBe('2');
    expect(initialState.currentCategory).toBe('1');
});

test('ADD_TO_CART', () => {
    let newState = reducer(initialState, {
        type: ADD_TO_CART,
        product: { purchaseQuantity: 1 }
    });

    // Remember, a reducer should treat the original state as immutable, so the test should verify that the initialState was not affected by the update.
    expect(newState.cart.length).toBe(3);
    expect(initialState.cart.length).toBe(2);
});

test('ADD_MULTIPLE_TO_CART', () => {
    let newState = reducer(initialState, {
        type: ADD_MULTIPLE_TO_CART,
        products: [{}, {}]
    });
  
    expect(newState.cart.length).toBe(4);
    expect(initialState.cart.length).toBe(2);
});

// The next few reducers will be a little trickier because they involve updating or deleting items from the cart

// This test will remove both cart items from initialState, one after the other.
// We want to test the removal of both because removing the last item from the cart should also close it (i.e., set cartOpen to false). 
test('REMOVE_FROM_CART', () => {
    let newState1 = reducer(initialState, {
        type: REMOVE_FROM_CART,
        _id: '1'
    });

    // cart is still open
    expect(newState1.cartOpen).toBe(true);

    // the second item should now be the first
    expect(newState1.cart.length).toBe(1);
    expect(newState1.cart[0]._id).toBe('2');

    let newState2 = reducer(newState1, {
        type: REMOVE_FROM_CART,
        _id: '2'
    });

    // cart is empty and closed
    expect(newState2.cartOpen).toBe(false);
    expect(newState2.cart.length).toBe(0);

    expect(initialState.cart.length).toBe(2);
});

// In this test, we want to ensure that only the first item's quantity is updated, because its _id matches the _id given to the reducer() function.
test('UPDATE_CART_QUANTITY', () => {
    let newState = reducer(initialState, {
        type: UPDATE_CART_QUANTITY,
        _id: '1',
        purchaseQuantity: 3
    });

    expect(newState.cartOpen).toBe(true);
    expect(newState.cart[0].purchaseQuantity).toBe(3);
    // The second item's purchaseQuantity should remain at 2.
    expect(newState.cart[1].purchaseQuantity).toBe(2);

    expect(initialState.cartOpen).toBe(false);
});

// This test simply expects the cart to be empty (and closed) after the CLEAR_CART action is called.
test('CLEAR_CART', () => {
    let newState = reducer(initialState, {
        type: CLEAR_CART
    });
  
    expect(newState.cartOpen).toBe(false);
    expect(newState.cart.length).toBe(0);
    expect(initialState.cart.length).toBe(2);
});

// This test expects cartOpen to be the opposite of its previous value each time the action is called
test('TOGGLE_CART', () => {
    let newState = reducer(initialState, {
        type: TOGGLE_CART
    });

    expect(newState.cartOpen).toBe(true);
    expect(initialState.cartOpen).toBe(false);

    let newState2 = reducer(newState, {
        type: TOGGLE_CART
    });

    expect(newState2.cartOpen).toBe(false);
});