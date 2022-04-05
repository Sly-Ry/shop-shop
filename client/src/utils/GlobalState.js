// createContext will be used to instantiate a new Context object. The more meaningful term we can use here is that we're using it to create the container to hold our global state data and functionality so we can provide it throughout our app!
// useContext is another React Hook that will allow us to use the state created from the createContext function.
import React, { createContext, useContext } from 'react';
import { useProductReducer } from './reducers';

// When we run the createContext() function, it creates a new Context object.
const StoreContext = createContext();
const { Provider } = StoreContext;

// A custom provider function that will be used to manage and update our state using the reducer we created earlier as well. Having this all bundled up will make it easier to integrate into our application.
// With all of this in place, the StoreProvider function isn't as much of a function as it is our own custom <Provider> component! That's why the parameters defined at the top, the value and ...props, are there. It's actually set up to accept props if it needs to, and it does!
    // The value prop is good to have included, as it opens us up to pass in more data for state if we need to. We don't actually need to in this app, but it makes this provider flexible.
    // The other prop, or rather ...props, is in place to handle any other props the user may need. Namely, we'll need to use props.children, as this <StoreProvider> component will wrap all of our other components, making them children of it. 
const StoreProvider = ({ value = [], ...props }) => {
    // we instantiate our initial global state with the useProductReducer() function we created earlier
    // Because that wraps it around the useReducer() Hook from React, every time we run this useProductReducer() function, we receive the following two items in return:
        // 1. state is the most up-to-date version of our global state object.
        // 2. dispatch is the method we execute to update our state. It is specifically going to look for an action object passed in as its argument, as we'll soon see.
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: '',
    });
    // use this to confirm it works!
    console.log(state);
    // After the useProductReducer() completes and provides us with the new state and function to update state (e.g., dispatch), we then return the StoreContext's <Provider> component with our state object and dispatch the function provided as data for the value prop.
    // If we didn't include {...props} in our returning <Provider> component, nothing on the page would be rendered!
    return <Provider value={[state, dispatch]} {...props} />;
};

// A custom function using the useContext() Hook to be used by the components that actually need the data our <StoreProvider> provides.
// When we execute this function from within a component, we will receive the [state, dispatch] data our StoreProvider provider manages for us. This means that any component that has access to our StoreProvider component can use any data in our global state container or update it using the dispatch function.
const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };