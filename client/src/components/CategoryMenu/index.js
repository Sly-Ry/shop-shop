import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY
} from '../../utils/actions';
import { useStoreContext } from '../../utils/GlobalState';
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  // Now when we use this component, we immediately call upon the useStoreContext() Hook to retrieve the current state from the global state object and the dispatch() method to update state. 
  const [state, dispatch] = useStoreContext();

  // Because we only need the categories array out of our global state, we simply destructure it out of state so we can use it to provide to our returning JSX.
  const { categories } = state;
  
  // we'll query our category data, store it into the global state object, and then use the category data from the global state object to use it in the UI instead. 
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  // when this component loads and the response from the useQuery() Hook returns, the useEffect() Hook notices that categoryData is not undefined anymore and runs the dispatch() function, setting our category data to the global state!
  // The function runs immediately on load and passes in our function to update the global state and then the data that we're dependent on: categoryData and dispatch.
  //  Now, categoryData is going to be undefined on load because the useQuery() Hook isn't done with its request just yet, meaning that if statement will not run, but the beauty of the useEffect() Hook is that it not only runs on component load, but also when some form of state changes in that component. So when useQuery() finishes, and we have data in categoryData, the useEffect() Hook runs again and notices that categoryData exists! Because of that, it does its job and executes the dispatch() function.
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } 
    else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  // A click handler to update our global state instead of using the function we receive as a prop from the Home component.
  // Now when we retrieve our category content from the server, we immediately save it to our global state object and use that data to print the list of categories to the page. We also set it up where when we click one of those categories, we save that category's _id value to the global state as well
  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
