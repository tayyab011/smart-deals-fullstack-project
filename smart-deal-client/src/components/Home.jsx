import React, { Suspense } from 'react';
import LatestProduct from './LatestProduct';

const Home = () => {
   const latestProduct = fetch("http://localhost:5050/latestProduct").then(
     (res) => res.json()
   )
  return (
    <div className=" container mx-auto">


      
      <Suspense fallback="loading">
        <LatestProduct latestProduct={latestProduct} />
      </Suspense>
    </div>
  );
};

export default Home;