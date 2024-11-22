import axios from "axios";
import { useState, useEffect } from "react";

const p = {
  api: "", //api link
  active: true, //conditional calls
  params: {}, //parameters for the api calls
  deps: [], //dependencies
  cb: () => {}, //callback functions
};

export default function useGet(props = p) {
  const allProps = { ...p, ...props }; //add the changes to the params the user made and keeping the original
  //params on rest of the code
  const [state, setState] = useState({ params: allProps.params });
  const get = (params = {}) => {
    const allParams = { ...allProps.params, ...params };
    if (state.loading) return;
    setState({ loading: true, params: allParams });
    axios
      .get("http://localhost:8080/" + allProps.api, { params: allParams })
      .then((res) => {
        setState({ res, params: allParams });
        allProps.cb(res);
      })
      .catch((err) => setState({ err, params: allParams }));
  };
  useEffect(() => {
    if (!allProps.active) return;
    get();
  }, [allProps.active, ...allProps.deps]); //runs when dependencies or condition changes
  return { ...state, get };
}
