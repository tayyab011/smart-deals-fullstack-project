import React from 'react';

const Loader = () => {
    return (
      <div className="flex h-screen justify-center items-center" role="status">
        <div className="loading loading-spinner loading-xl text-primary"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
};

export default Loader;