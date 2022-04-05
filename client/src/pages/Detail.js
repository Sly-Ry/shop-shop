import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useStoreContext } from "../utils/GlobalState";
import { UPDATE_PRODUCTS } from "../utils/actions";
import { QUERY_PRODUCTS } from '../utils/queries';

import spinner from '../assets/spinner.gif';

import Cart from '../components/Cart';

function Detail() {
  const [state, dispatch] = useStoreContext();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({})

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products } = state;

  // the useEffect() Hook here has to check for a couple of things. It first checks to see if there's data in our global state's products array.
  useEffect(() => {
    //  If there is, we use it to figure out which product is the current one that we want to display. 
    if (products.length) {
      // It does this finding the one with the matching _id value that we grabbed from the useParams() Hook.
      setCurrentProduct(products.find(product => product._id === id));
    } else if (data) {
      // The useEffect() Hook is set up so that if we don't have any products saved in global state, we'll use the product data that we returned from the useQuery() Hook to set the product data to the global state object
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
    }
}, [products, data, dispatch, id]);

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button>Add to Cart</button>
            <button>Remove from Cart</button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
          <Cart />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </>
  );
}

export default Detail;
