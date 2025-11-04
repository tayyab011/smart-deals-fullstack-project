import React, { use, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthContext";

const ProductDetails = () => {
  const [status,setStatus]=useState("")
  const [modal,showModal]=useState(false)
  const [bids,setBids]=useState([]);

  useEffect
  const {user}=use(AuthContext)
const navigate= useNavigate()
    const product =useLoaderData();
    const {
      _id,
      condition,
      usage,
      title,
      image,
      price_min,
      price_max,
      description,
      category,
      created_at,
    } = product || {};
  useEffect(() => {
    fetch(`http://localhost:5050/bids/${_id}`, {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBids(data));
  }, [_id,user]);
     const bidHandler=(e)=>{
      e.preventDefault()
 const name=e.target.name.value
 const email = e.target.email.value;
 const bid = e.target.bid.value;

/*  console.log(_id,name,email,bid) */
 const newBid = {
   product: _id,

   buyer_name: name,
   buyer_email: email,
   bid_price: bid,
   status:"pending"
 };
 
 fetch("http://localhost:5050/bids",{
  method:"POST",
  headers:{
    "content-type":"application/json"
  },
  body :JSON.stringify(newBid)
 }).then(res=>res.json()).then(data=>{
  if (data.insertedId) {
    newBid._id = data.insertedId
    setBids([...bids,newBid])
    alert("bids sent successfull");
    showModal(false)
  }
  
  console.log("after post bid",data)})
     }
     const sortedBid = [...bids].sort((a, b) => b.bid_price - a.bid_price);

     const statusHandler=(_id,status)=>{


 fetch(`http://localhost:5050/bids/${_id}`, {
   method: "PUT",
   headers: {
     "content-type": "application/json",
   },
   body: JSON.stringify({ status: status }),
 
 })
   .then((res) => res.json())
   .then((data) => {
     alert("status updated successfull");
     setStatus(status)
     console.log("status", data);
   });
     }
     console.log("after every thing",status)
  return (
    <div className="min-h-screen  py-10 px-4">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost text-sm mb-4"
        >
          ← Back To Products
        </button>

        {/* Main Product Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left - Product Image */}
          <div className="col-span-1">
            <img
              className="h-64  rounded-xl flex items-center justify-center"
              src={image}
              alt=""
            />
            <div className="bg-base-100 rounded-xl shadow-sm mt-10 p-6">
              <h3 className="font-semibold mb-3">Product Description</h3>
              <div className="flex items-center gap-4 text-sm mb-3">
                <span>
                  Condition:{" "}
                  <span className="text-purple-600 font-medium">
                    {condition}
                  </span>
                </span>
                <span>
                  Usage Time:{" "}
                  <span className="text-purple-600 font-medium">{usage}</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="col-span-2 space-y-4">
            <h1 className="text-2xl font-semibold">{title}</h1>

            <span className="badge badge-secondary">{category}</span>

            <p className="text-green-600 font-semibold text-lg">
              ${price_min} - ${price_max}
              <span className="text-gray-500 text-sm font-normal block">
                Price starts from
              </span>
            </p>

            {/* Product Details Card */}
            <div className="bg-base-100 p-4 rounded-xl shadow-sm">
              <h2 className="font-semibold mb-2">Product Details</h2>
              <p className="text-sm text-gray-500">
                Product ID: <span className="text-gray-700">{_id}</span>
              </p>
              <p className="text-sm text-gray-500">
                Posted:{" "}
                <span className="text-gray-700">{created_at.split("/")}</span>
              </p>
            </div>

            {/* Seller Information */}
            <div className="bg-base-100 p-4 rounded-xl shadow-sm">
              <h2 className="font-semibold mb-2">Seller Information</h2>
              <p className="text-sm text-gray-700">Sara Chen</p>
              <p className="text-sm text-gray-500">carsHub.sara@shop.net</p>
              <p className="text-sm text-gray-500">Location: Los Angeles, CA</p>
              <p className="text-sm text-gray-500">
                Contact: sara.chen.contact
              </p>
              <div className="badge badge-success mt-1">Active Seller</div>
            </div>

            <button
              onClick={() => showModal(true)}
              className="btn btn-primary w-full mt-3"
            >
              I Want Buy This Product
            </button>
          </div>
        </div>

        {/* modal  start*/}
        {/* The button to open modal */}
        {/*  <label htmlFor="my_modal_6" className="btn">
          open modal
        </label> */}

        {/* Put this part before </body> tag */}
        {modal && (
          <div>
            <div className="modal modal-open ">
              <div className="modal-box  px-4 py-10 mx-8 md:mx-0 shadow-2xl rounded-3xl sm:p-10">
                <div className="relative">
                  <form onSubmit={bidHandler}>
                    <div className="max-w-md mx-auto">
                      <div className="flex items-center space-x-5 justify-center"></div>
                      <div className="mt-5">
                        <label
                          className="font-semibold text-sm text-gray-600 pb-1 block"
                          for="login"
                        >
                          Name
                        </label>
                        <input
                          className="border cursor-not-allowed  rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                          type="text"
                          name="name"
                          disabled={true}
                          value={user?.displayName}
                        />

                        <label
                          className="font-semibold text-sm text-gray-600 pb-1 block"
                          for="login"
                        >
                          E-mail
                        </label>
                        <input
                          className="border cursor-not-allowed  rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                          type="email"
                          name="email"
                          disabled={true}
                          value={user?.email}
                        />
                        <label
                          className="font-semibold text-sm text-gray-600 pb-1 block"
                          for="bid"
                        >
                          Bid
                        </label>
                        <input
                          className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                          type="text"
                          name="bid"
                          placeholder="place your bid"
                        />
                      </div>

                      <div className="mt-5">
                        <button
                          className="py-2 px-4 w-full text-center btn-primary"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-action">
                  <label onClick={() => showModal(false)} className="btn">
                    Close!
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* modal  end*/}

        {/* Product Description */}

        {/* Bids Section (Visible to Owner) */}
        <div className="mt-10 opacity-90">
          <p className="text-xl font-semibold text-gray-400">
            Only Visible to Owner
          </p>
          <h3 className="text-2xl font-bold mt-2">
            Bids For This Products:{" "}
            <span className="text-purple-600">{bids?.length}</span>
          </h3>

          <div className="overflow-x-auto mt-6 bg-base-100 rounded-xl shadow-sm">
            <div>
              {bids.length === 0 ? (
                <h1 className="bg-transparent">no data found</h1>
              ) : null}
            </div>
            <table className="table w-full">
              {bids.length > 0 && (
                <thead>
                  <tr className="bg-base-200 text-gray-600">
                    <th>SL No</th>
                    <th>Product</th>
                    <th>Seller</th>
                    <th>Bid Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
              )}

              <tbody>
                {bids.length > 0 &&
                  sortedBid.map((data, index) => (
                    <tr key={data._id}>
                      <td>{index + 1}</td>
                      <td>{title}</td>
                      <td>
                        <div>
                          <p className="font-semibold">{data?.buyer_name}</p>
                          <p className="text-xs text-gray-500">
                            {data?.buyer_email}
                          </p>
                        </div>
                      </td>
                      <td>{data?.bid_price}</td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => statusHandler(data?._id, "accepted")}
                          className={`btn btn-success  btn-xs ${
                            data.status === "accepted"
                              ? " border-2 border-black "
                              : null
                          }`}
                        >
                          Accept Offer
                        </button>

                        <button
                          onClick={() => statusHandler(data?._id, "rejected")}
                          className={`btn btn-error  btn-xs ${
                            data.status === "rejected"
                              ? " border-2 border-black "
                              : null
                          }`}
                        >
                          Reject Offer
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
