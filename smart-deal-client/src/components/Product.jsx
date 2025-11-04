import React from "react";
import { Link, useNavigate } from "react-router";

const Product = ({ product }) => {
    const navigate=useNavigate()
  const { _id,title, image, price_min, price_max } = product || {};
  return (
    <div>
      <div className="card  shadow-sm space-y-4">
        <figure className="p-4">
          <img src={image} alt="product" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>
            price:{" "}
            <span className="font-bold">
              {" "}
              ${price_min} - ${price_max}
            </span>
          </p>
          <div className="card-actions justify-end">
            <button
              onClick={() => navigate(`/productDetails/${_id}`)}
              className="btn w-full btn-primary"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
