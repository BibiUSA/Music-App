import Context from "./context";
import { useState, useEffect } from "react";
import { firebaseAuth } from "../../Firebase";
import { onAuthStateChanged } from "firebase/auth";
// import { axios } from "axios";
// import useGet from "../../hooks/useGet";

const Provider = (props) => {
  const [user, setUser] = useState("loading");
  //

  useEffect(() => {
    console.log("Provider ran");
    const unsub = onAuthStateChanged(firebaseAuth, (userInfo) => {
      console.log("AUTH State changed", userInfo);
      setUser(userInfo);
    });
    return () => unsub();
  }, []);

  //need this examined

  if (user === "loading") {
    return <div>Get Your Headphones...</div>;
  }

  // eslint-disable-next-line react/prop-types
  return <Context.Provider value={{ user }}>{props.children}</Context.Provider>;
};

export default Provider;
