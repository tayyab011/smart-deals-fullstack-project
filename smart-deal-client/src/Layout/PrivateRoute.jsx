import React, { use } from 'react';
import { AuthContext } from '../provider/AuthContext';
import { Navigate, useLocation } from 'react-router';
import Loader from '../components/Loader';

const PrivateRoute = ({children}) => {
    const {user,loader}=use(AuthContext)
 const location=useLocation()

 if (loader) {
    return <Loader/>
 }else if (user) {
         return children
    }else{
        return <Navigate state={location?.pathname} to="/login"/>
    }
   
      
};

export default PrivateRoute;