import React, { use, useEffect, useState } from 'react';
import { AuthContext } from '../provider/AuthContext';

const MyBids = () => {
    const {user}=use(AuthContext)
    const [myBid,setMyBid]=useState([])
   
    useEffect(() => {
      if (user?.email) {
        fetch(`http://localhost:5050/bids?email=${user?.email}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,/*  ${user.accessToken} */
          },
        })
          .then((res) => res.json())
          .then((data) => setMyBid(data))
          .catch((error) => {
            console.error("Fetch error:", error.message);
          });
      }
    }, [user]);
    return (
      <div>
        <h1>{myBid.length}</h1>
        <div className="overflow-x-auto mt-6  rounded-xl shadow-sm">
          <div>
            {myBid.length === 0 ? (
              <h1 className="bg-transparent">no data found</h1>
            ) : null}
          </div>
          <table className="table w-full">
            {myBid.length > 0 && (
              <thead>
                <tr className=" text-gray-600">
                  <th>SL No</th>
                  <th>Name</th>
                  <th>Job</th>
                  <th>Favouret Color</th>
                  <th>Actions</th>
                </tr>
              </thead>
            )}

            <tbody>
              {myBid.length > 0 &&
                myBid.map((data, index) => (
                  <tr key={data._id}>
                    <td>{index + 1}</td>
                    <td>wfw</td>
                    <td>
                      <div>
                        <p className="font-semibold">{data?.buyer_name}</p>
                        <p className="text-xs text-gray-500">
                          {data?.buyer_email}
                        </p>
                      </div>
                    </td>
                    <td>{data?.bid_price}</td>
                    <td className="flex gap-2 justify-between">
                      <button className="btn btn-success btn-xs">
                       {data?.status}
                      </button>
                      <button className="btn btn-error btn-xs">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default MyBids;