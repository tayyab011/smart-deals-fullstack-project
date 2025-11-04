import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import App from './App.jsx'
import RootLayout from './Layout/RootLayout.jsx';
import Home from './components/Home.jsx';
import AllProducts from './components/AllProducts';
import AuthProvider from './provider/AuthProvider.jsx';
import Login from './components/Login';
import Register from './components/Register.jsx';
import ProductDetails from './components/ProductDetails';
import MyBids from './components/MyBids';
import PrivateRoute from './Layout/PrivateRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/allproducts",
        loader: () => fetch(`http://localhost:5050/product`),
        element: <AllProducts />,
      },
      {
        path: "/productDetails/:id",
        loader: ({ params }) =>
          fetch(`http://localhost:5050/product/${params.id}`),
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/mybids",
        element: (
          <PrivateRoute>
            <MyBids />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
