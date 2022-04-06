# shop-shop
State application

LESSONS LEARNED
Lesson 3
    
    Read and write data to IndexedDB.

    Use React Hooks like useEffect().

    Dispatch updates to the global state object.

    Use IndexedDB within a React component.

    Cache server-side data using IndexedDB.

NOTES

* Note that the starter code for this module includes a service worker. The service worker inclusion is no longer the default behavior for the most recent version of the create-react-app utility. When using this utility in the future to make an app from scratch, remember that some additional arguments are required to add a service worker to your app. For more information, refer to the Create React App documentation on creating a PWA (Links to an external site.).

A lot of our state-across components relies on component-level Apollo query results. Those results affect the overall functionality that determines what we see in other components of our app, meaning other components need to constantly be made aware of those results, which is cumbersome. So by taking that returned data from the query result and storing it in a global state, we can effectively remove a lot of confusing data movement between components to keep them in sync.

Redux allows developers to centralize all of the data needed to make an application run properly and set it up in a global object that makes the data easy to use by the UI but also predictable in terms of how it's updated. Redux is built on the following three core principles, which aren't totally unique to Redux, as we'll soon see:

    - Single source of truth: By having all of the application's data stored in one location that isn't tied to any single piece of the UI, we can easily manipulate our app's UI without having to affect any of it.

    - State is read-only: This doesn't mean state can't be updated, but rather that it cannot be directly updated. Instead, it should be overwritten with a new iteration of that state. This makes it so that the application's state is updated in a predictable fashion and the UI won't ever get out of sync with its data.

    - State is changed through pure functions: This means that to make an update to state, we don't actually manipulate it. Instead, we overwrite it with a new version of it. This lowers the chance of any data being accidentally affected by an action. We do this by creating what's known as a reducer, which runs as a result of an action.

The name for a global state object is often referred to as a Store.

A global store is built on two important pieces when it comes to updating state:

    Actions: These define the types of events that can be emitted to update state. State can only be updated if it's a predefined action.

    Reducers: 
        A reducer is a function that updates state by returning a new state object and never alters the original state object. Now, that doesn't mean the data inside the state object isn't altered. Of course, it is—why else would we need to update state? The key takeaway here is that state is intended to be immutable, meaning it never should be directly altered in any way. The reason for this is that it goes behind the state management system's back and it isn't informed that something has changed

Because of this relationship, we'll need to create our actions before we create our reducers.

    Actions and reducers have a very similar relationship to how we use typeDefs and resolvers with GraphQL. We need to define what's to be interacted with, and then write the functionality that carries out that interaction.

* All we're doing is learning another way of managing state so that it's decoupled from our components. With our state decoupled, we can use it across more components and pages in our application and avoid making more HTTP calls than necessary or more importantly, prop drilling.

Prop drilling is what happens when we manage state at a top-level component that needs to be passed through multiple child components as props. When the data is passed around too much, it becomes difficult to keep track of which components are reliant on which data. To remedy this, creating a global state object will allow any component in our application to use and update state without having to worry about receiving that information as props. This will make our component much more readable, and create data much more reusable over time.

Every Context object comes with two components, a Provider and Consumer. 
    
    The Provider is a special type of React component that we wrap our application in so it can make the state data that's passed into it as a prop available to all other components. 
    
    The Consumer is our means of grabbing and using the data that the Provider holds for us.

* This is a lot to absorb, for both beginners and veterans in the web development community! But it seems to be a solution that isn't going away any time soon. The good thing is, after practicing and implementing it a few times, it's actually not too bad! Just like GraphQL, it just requires a bit more planning ahead of time, as you need to plan out what you want to hold in a global state object and how to actually update it using actions and reducers.

* Why would we save the current product locally and not to the global state?
    
    This is one of those cases where saving a single product to the global state object doesn't actually benefit us in any way, shape, or form. The single product's data will only be used in this specific component at this specific moment. This is the same reason why we don't worry about saving form entry data from the login or signup forms to global state; it only needs to exist when we're using those components!

Lesson 3

With the IndexedDB database, we'll accomplish the following two main performance enhancements:

We'll store all of the product and category data from the database in IndexedDB. This way, even without an internet connection, users can still navigate the application, view items, and even add items to their shopping cart.

If the user leaves the application and comes back later, we'll have persisted the items in their shopping cart. A user is more likely to complete their order if they don't have to add everything back into the cart!

* We used a custom function, but there are libraries out there that offer help in working with browser storage. Try a library called LocalForage (Links to an external site.) if you're ever interested!

