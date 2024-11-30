import ChangeProfile from "../../components/ChangeProfile";
import useGet from "../../hooks/useGet";
import context from "../../contexts/auth/context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import ChangeUsername from "../../components/ChangeUsername";

import "./Settings.css";
export default function Settings() {
  const { user } = useContext(context);
  const [fullData, setFullData] = useState([]);
  console.log("USER", user);
  console.log("FULL", fullData);

  useEffect(() => {
    console.log(user);
    getUserInfo();
  }, []);

  const inputs = [
    {
      id: "registerFirstName",
      name: "firstName",
      type: "text",
      errorMessage:
        "Requires a letter and minimum of 2 characters. Allowed signs are period, coma, hyphen, apostrophe",
      placeholder: `${fullData.fname}`,
      pattern: "^[A-Za-z][A-Za-z ,.'\\-]{0,24}[A-Za-z]$",
    },
    {
      id: "registerLasttName",
      name: "lastName",
      type: "text",
      errorMessage:
        "Requires a letter and minimum of 2 characters. Allowed signs are period, coma, hyphen, apostrophe",
      placeholder: `${fullData.lname}`,
      pattern: "^[A-Za-z][A-Za-z ,.'\\-]{0,24}[A-Za-z]$",
    },
  ];

  // useGet({
  //   api: "user/info",
  //   params: { user: user.uid },
  //   dep: user,
  //   cb: (res) => {
  //     console.log("CHECk", res.data.rows);
  //     setFullData(res.data.rows);
  //   },
  // });

  const getUserInfo = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/user/info`, {
        params: { uid: user.uid },
      });
      setFullData(result.data.rows[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      Settings
      <div>
        <ChangeProfile />

        {inputs.map((input) => (
          <div key={input.id} data-mdb-input-init className="form-outline mb-4">
            <input
              type={input.type}
              id={input.id}
              className="form-control"
              name={input.name}
              placeholder={input.placeholder}
              // value={values[input.name] || ""}
              // onChange={onChange}
              pattern={input.pattern}
              // onBlur={handleFocus}
              required
              // focused={focused[input.name]}
            ></input>
            <span className="errorMsg">{input.errorMessage}</span>
            <label className="form-label" htmlFor={input.id}>
              {input.name}
            </label>
          </div>
        ))}

        <ChangeUsername data={fullData} />
      </div>
    </div>
  );
}
