import { useState } from "react";
import { firebaseAuth } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Placeholder } from "react-bootstrap";
import "./Register.css";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import useTotalSaveUser from "../hooks/useTotalSaveUser";

import { signInGoogle, signInFacebook } from "../utils/SignInAuthentication";

export default function Register() {
  const navigate = useNavigate();
  const { saveUser } = useTotalSaveUser();

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    registerUserName: "",
  });
  const [focused, setFocused] = useState({
    firstName: "false",
    lastName: "false",
    email: "false",
    password: "false",
    repeatPassword: "false",
    userName: "false",
  });
  const [userNameReady, setUserNameReady] = useState();
  const [verifiedUsrName, setVerifiedUsrName] = useState();

  const checkUsrAvailable = async (username) => {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._]{1,13}[a-zA-Z0-9]$/.test(username)) {
      setUserNameReady(-1);
      return;
    }
    try {
      const result = await axios.get(`/user/check/`, {
        params: { username: username },
      });
      setUserNameReady(result.data.rows[0].count);
      if (result.data.rows[0].count == 0) {
        setVerifiedUsrName(username);
      }
      console.log(username);
    } catch (error) {
      console.log(error);
    }
  };

  //used to map over input and label
  const inputs = [
    {
      id: "registerFirstName",
      name: "firstName",
      type: "text",
      errorMessage:
        "Requires a letter and minimum of 2 characters. Allowed signs are period, coma, hyphen, apostrophe",
      placeholder: "First Name",
      pattern: "^[A-Za-z][A-Za-z ,.'\\-]{0,24}[A-Za-z]$",
    },
    {
      id: "registerLasttName",
      name: "lastName",
      type: "text",
      errorMessage:
        "Requires a letter and minimum of 2 characters. Allowed signs are period, coma, hyphen, apostrophe",
      placeholder: "Last Name",
      pattern: "^[A-Za-z][A-Za-z ,.'\\-]{0,24}[A-Za-z]$",
    },

    {
      id: "registerEmail",
      name: "email",
      type: "email",
      errorMessage: "Enter a valid email.",
      placeholder: "Email",
    },
    {
      id: "registerPassword",
      name: "password",
      type: "password",
      errorMessage:
        "Requirements: at least 1 digit, 1 special character from !@#$%^&*, 6-16 characters long",
      placeholder: "Password",
      pattern: "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,30}$",
    },
    {
      id: "registerRepeatPassword",
      name: "repeatPassword",
      type: "password",
      errorMessage: "Passwords don't match.",
      placeholder: "Repeat Password",
      pattern: values.password,
    },
    {
      id: "registerUserName",
      name: "registerUserName",
      type: "text",
      className: "username_input",
      errorMessage: "Username didn't meet the requirement.",
      placeholder: "Enter your username",
      pattern: "^[a-zA-Z0-9][a-zA-Z0-9._]{1,13}[a-zA-Z0-9]$",
    },
  ];

  //submits the form to firebasse and if the user is created, saves info to postgres
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userNameReady != 0) {
      return;
    }
    console.log("here");
    createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        saveUser(
          values.firstName,
          values.lastName,
          values.email,
          user.uid,
          verifiedUsrName
        );
      })
      .catch((error) => {
        console.log(error);
        // ..
      });
  };

  const handleFocus = (e) => {
    setFocused({ ...focused, [e.target.name]: "true" });
  };

  //sets input states on keystrokes
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="tab-pane fade show active"
      id="pills-register"
      role="tabpanel"
      aria-labelledby="tab-register"
    >
      <div className="text-center mb-3">
        <p>Sign up with:</p>
      </div>
      <div className="google-facebook">
        {/* <iframe
          onClick={signInGoogle}
          className="googleSignIn"
          src="https://developers.google.com/frame/identity/sign-in/web/demos/signin_contextual_custom.jshtml"
        ></iframe> */}
        {/* <button onClick={signInFacebook}>Facebook</button> */}
      </div>

      <form onSubmit={handleSubmit}>
        {/* turned off for now */}
        {/* <p className="text-center">or:</p> */}

        {inputs.map((input) => (
          <div key={input.id} data-mdb-input-init className="form-outline mb-4">
            <input
              type={input.type}
              id={input.id}
              className={input.className || "form-control"}
              name={input.name}
              placeholder={input.placeholder}
              value={values[input.name] || ""}
              onChange={onChange}
              pattern={input.pattern}
              onBlur={handleFocus}
              required
              focused={focused[input.name]}
            ></input>
            {input.name == "registerUserName" && (
              <button
                className="username_button"
                onClick={() => checkUsrAvailable(values.registerUserName)}
              >
                Check Availability
              </button>
            )}
            <label className="form-label" htmlFor={input.id}>
              {input.placeholder}
            </label>
            {input.name == "password" && (
              <span className="rule">
                {
                  "Must contain least 1 digit, 1 special character from !@#$%^&*, 6-16 characters long"
                }
              </span>
            )}
            {input.name == "registerUserName" && (
              <div>
                {userNameReady < 0 && (
                  <span className="userNameMssg wrong">
                    {"letters, numbers, [._] only. 3 to 15 characters long"}
                  </span>
                )}
                {userNameReady > 0 && (
                  <span className="userNameMssg wrong">
                    {"Username not available"}
                  </span>
                )}
                {userNameReady == 0 && (
                  <span className="userNameMssg available">
                    {" "}
                    {`${verifiedUsrName} is available!!`}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {/* <!-- Submit button --> */}

        {userNameReady == 0 ? (
          <button
            type="submit"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-primary btn-block mb-3"
          >
            Sign Up
          </button>
        ) : (
          <button
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-secondary btn-block mb-3"
          >
            Sign Up
          </button>
        )}
      </form>
    </div>
  );
}
