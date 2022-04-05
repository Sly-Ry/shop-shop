import { reducer } from '../utils/reducers';
// import our actions
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from '../utils/actions';

// create a sample of what our global state will look like
const initialState = {
    products: [],
    categories: [{ name:'Food'}],
    currentCategory: '1',
}

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