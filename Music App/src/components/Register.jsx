import { useState } from "react";
import { firebaseApp, firebaseAuth } from "../Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Placeholder } from "react-bootstrap";
import "./Register.css";
import axios from "axios";

import { signInGoogle, signInFacebook } from "../utils/SignInAuthentication";

export default function Register() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [focused, setFocused] = useState({
    firstName: "false",
    lastName: "false",
    email: "false",
    password: "false",
    repeatPassword: "false",
  });

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
      pattern: "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$",
    },
    {
      id: "registerRepeatPassword",
      name: "repeatPassword",
      type: "password",
      errorMessage: "Passwords don't match.",
      placeholder: "Repeat Password",
      pattern: values.password,
    },
  ];

  //submits the form to firebasse and if the user is created, saves info to postgres
  const handleSubmit = async (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        saveUserInfo(
          values.firstName,
          values.lastName,
          values.email,
          user.uid,
          new Date()
        );
        updateProfile(firebaseAuth.currentUser, {
          displayName: `user${user.uid.slice(0, 6)}`,
        }).then(() => {
          console.log(`user${user.uid.slice(0, 6)}`);
        });
        // ...
      })
      .catch((error) => {
        console.log(error);
        // ..
      });
  };
  //NEED TO WORK ON THIS
  //request to save userinfo in database
  const saveUserInfo = async (
    fname,
    lname,
    email,
    firebaseUID,
    date_created
  ) => {
    try {
      const response = await axios.post(
        "https://music-app-api-oq6b.onrender.com/user/save/",
        {
          fname: fname,
          lname: lname,
          email: email,
          firebaseUID: firebaseUID,
          date_created: date_created,
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
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

      <iframe
        onClick={signInGoogle}
        className="googleSignIn"
        src="https://developers.google.com/frame/identity/sign-in/web/demos/signin_contextual_custom.jshtml"
      ></iframe>
      <button onClick={signInFacebook}>Facebook</button>

      <form onSubmit={handleSubmit}>
        <p className="text-center">or:</p>

        {inputs.map((input) => (
          <div key={input.id} data-mdb-input-init className="form-outline mb-4">
            <input
              type={input.type}
              id={input.id}
              className="form-control"
              name={input.name}
              placeholder={input.placeholder}
              value={values[input.name] || ""}
              onChange={onChange}
              pattern={input.pattern}
              onBlur={handleFocus}
              required
              focused={focused[input.name]}
            ></input>

            <label className="form-label" htmlFor={input.id}>
              {input.placeholder}
            </label>
          </div>
        ))}

        {/* <!-- Submit button --> */}
        <button
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="btn btn-primary btn-block mb-3"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
