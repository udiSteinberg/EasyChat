import React, { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  const updateDisplayNameInContext = (newDisplayName) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      displayName: newDisplayName
    }));
  };

  const updateProfilePhotoInContext = (downloadUrl) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      photoURL: downloadUrl
    }));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, updateDisplayNameInContext, updateProfilePhotoInContext }}>
      {children}
    </AuthContext.Provider>
  );
};
