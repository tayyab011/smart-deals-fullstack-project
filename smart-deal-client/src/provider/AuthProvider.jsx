import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";

const AuthProvider = ({ children }) => {
  const [loader, setLoader] = useState(true);
  const [user, setUser] = useState(null);
  const googleProvider = new GoogleAuthProvider();

  const register = (email, password) => {
    setLoader(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const login = (email, password) => {
    setLoader(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const googleSignin = () => {
    setLoader(true);
    return signInWithPopup(auth, googleProvider);
  };
  const logout = () => {
    return signOut(auth)
      .then(() => alert("logout successfull"))
      .catch(() => alert("somthing went wrong"));
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const loggedUser = {
        email: currentUser.email,
      };
      if (currentUser) {
        fetch(`http://localhost:5050/getToken`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(loggedUser),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("after getting token", data);
            localStorage.setItem("token", data.token);
          });
      }else{
        localStorage.removeItem("token")
      }
      setLoader(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const data = {
    register,
    login,
    user,
    googleSignin,
    logout,
    loader,
    setLoader,
  };
  return <AuthContext value={data}>{children}</AuthContext>;
};

export default AuthProvider;
