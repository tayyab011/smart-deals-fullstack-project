import React from 'react';
import { useLoaderData } from 'react-router';
import Product from './Product';

const AllProducts = () => {
    const newProduct=useLoaderData()
    return (
      <div>
        <div className="grid mx-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 gap-5">
          {newProduct.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    );
};

export default AllProducts;