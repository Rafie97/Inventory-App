import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { Provider } from "react-redux";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children, store }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if (pending) {
    return <h1>Loading...</h1>;
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      <Provider store={store}>{children}</Provider>
    </AuthContext.Provider>
  );
};
