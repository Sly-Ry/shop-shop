import { useReducer } from 'react';
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
} from "./actions";


// We use the same function to handle all actions. 
// Instead of writing a reducer for each action, we use one that will look for a matching action value and return a new copy of state from there. If our state was much more complex, the need for multiple reducer functions may arise, but our state is simple enough that it makes the most sense to keep it all together in one function.
export const reducer = (state, action) => {
    // We pass the value of the action.type argument into a switch statement and compare it to our possible actions
    switch (action.type) {
        // If it's that action type, we return a new object with a copy of the state argument using the spread ... operator and then set the products key to a value of a new array with the action.products value spread across it. 
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.products],
            };

        // if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            };

        
        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            };

        case ADD_TO_CART:
            return {
                // Let's not forget to include the ...state operator to preserve everything else on state. 
                ...state,
                // Set cartOpen to true so that users can immediately view the cart with the newly added item, if it's not already open
                cartOpen: true,
                //  Update the cart property to add action.product to the end of the array.
                cart: [...state.cart, action.product]
            };

        case ADD_MULTIPLE_TO_CART:
            return {
                ...state,
                cart: [...state.cart, ...action.products],
            };
    
        case REMOVE_FROM_CART:
            // Note the use of the filter() method that only keeps the items that don't match the provided _id property. 
            let newState = state.cart.filter(product => {
                return product._id !== action._id;
            });
            
            // we also check the length of the array to set cartOpen to false when the array is empty.
            return {
                ...state,
                cartOpen: newState.length > 0,
                cart: newState
            };

        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartOpen: true,
                cart: state.cart.map(product => {
                    if (action._id === product._id) {
                        product.purchaseQuantity = action.purchaseQuantity;
                    }
                    return product;
                })
            };

        case CLEAR_CART:
            return {
                ...state,
                cartOpen: false,
                cart: []
            };
        
        case TOGGLE_CART:
            return {
                ...state,
                cartOpen: !state.cartOpen
            };
    // if it's none of these actions, do not update state at all and keep things the same!
        default:
            return state;
    }
};

// This function will be used to help initialize our global state object and then provide us with the functionality for updating that state by automatically running it through our custom reducer() function. Think of this as a more in-depth way of using the useState() Hook we've used so much.
// The useState() Hook is great for managing simpler amounts of state, like form field values and the status of a button being clicked. The useReducer() Hook is meant specifically for managing a greater level of state.
export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
};