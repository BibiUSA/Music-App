import Context from "./context";
import { useState, useEffect } from "react";
import { firebaseAuth } from "../../Firebase";
import { onAuthStateChanged } from "firebase/auth";
// import { axios } from "axios";
// import useGet from "../../hooks/useGet";
import { environment } from "../../environment";

const Provider = (props) => {
  const [user, setUser] = useState("loading");

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (userInfo) => {
      setUser(userInfo);
      environment.development && console.log(userInfo);
    });
  }, []);

  //need this examined

  if (user === "loading") {
    return "loading...";
  }
  // eslint-disable-next-line react/prop-types
  return <Context.Provider value={{ user }}>{props.children}</Context.Provider>;
};

export default Provider;
