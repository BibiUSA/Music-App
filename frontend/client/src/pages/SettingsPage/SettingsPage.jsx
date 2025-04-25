import ChangeProfile from "../../components/ChangeProfile";
import useGet from "../../hooks/useGet";
import context from "../../contexts/auth/context";
import { useContext, useEffect, useState } from "react";
import axios from "../../config/axios";
import ChangeUsername from "../../components/ChangeUsername";
import { firebaseAuth } from "../../Firebase";
import { signOut } from "firebase/auth";
import "./SettingsPage.css";
import { environment } from "../../environment";

export default function Settings() {
  const { user } = useContext(context);
  const [fullData, setFullData] = useState([]);
  const [names, setNames] = useState({}); //used to change first & last names

  if (!user) {
    window.location = "/login";
  }

  environment.development && console.log("USER", user);
  environment.development && console.log("FULL", fullData);

  useEffect(() => {
    environment.development && console.log(user);
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

  //updates state for fname & lnames
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setNames((values) => ({ ...values, [name]: value }));
  };

  const getUserInfo = async () => {
    try {
      const result = await axios.get(`/user/info`, {
        params: { uid: user.uid },
      });
      setFullData(result.data.rows[0]);
      setNames({
        ["firstName"]: result.data.rows[0].fname,
        ["lastName"]: result.data.rows[0].lname,
      });
    } catch (error) {
      environment.development && console.log(error);
    }
  };

  const editName = async () => {
    if (
      names.firstName !== fullData.fname ||
      names.lastName !== fullData.lname
    ) {
      environment.development && console.log(names);
      try {
        const result = await axios.patch(`/user/updatename`, {
          uid: fullData.firebase_uid,
          fname: names.firstName,
          lname: names.lastName,
        });
        environment.development && console.log(result);
      } catch (error) {
        environment.development && console.log(error);
      }
    }
    // console.log(names);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="settingBox">
        <ChangeProfile />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            editName();
          }}
        >
          {inputs.map((input) => (
            <div
              key={input.id}
              data-mdb-input-init
              className="form-outline mb-4"
            >
              <label className="form-label" htmlFor={input.id}>
                {input.name}
              </label>
              <span className="label-span">
                {input.name == "firstName" ? "First Name" : "Last Name"}
              </span>
              <input
                type={input.type}
                id={input.id}
                className="form-control"
                name={input.name}
                // placeholder={input.placeholder}
                // defaultValue={input.placeholder}
                value={names[input.name] || ""}
                onChange={handleChange}
                pattern={input.pattern}
                // onBlur={handleFocus}
                required
                // focused={focused[input.name]}
              ></input>
              <span className="errorMsg">{input.errorMessage}</span>
              {/* not sure why this isn't showing */}
            </div>
          ))}
          <button
            type="submit"
            className="btn btn-primary button-x update-button"
            // onClick={editName}
          >
            Update Name
          </button>
        </form>

        <ChangeUsername data={fullData} />
      </div>
      <button
        type="button"
        onClick={() => {
          signOut(firebaseAuth);
          window.location = "/profile";
        }}
      >
        SignOut
      </button>
    </div>
  );
}
