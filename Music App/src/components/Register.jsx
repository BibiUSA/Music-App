import { useState } from "react";
import { firebaseApp, firebaseAuth } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Placeholder } from "react-bootstrap";
import "./Register.css";

export default function Register() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    // userName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [focused, setFocused] = useState({
    firstName: "false",
    lastName: "false",
    // userName: "false",
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
    // {
    //   id: "registerUsername",
    //   name: "usertName",
    //   type: "text",
    //   errorMessage:
    //     "Requirements: 6-16 characters, start and end with alphanumeric characters, allowed signs: _ - .",
    //   placeholder: "User Name",
    //   pattern: "^[A-Za-z][A-Za-z0-9 .\\-_]{4,14}[A-Za-z0-9]$",
    // },
    {
      id: "registerEmail",
      name: "email",
      type: "email",
      errorMessage: "Enter a valid email.",
      placeholder: "Email",
      // pattern: "",
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

  const firebaseRegister = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        console.log(error);
        // ..
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        // ...
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
    console.log(e.target.pattern);
  };

  return (
    <div
      className="tab-pane fade show active"
      id="pills-register"
      role="tabpanel"
      aria-labelledby="tab-register"
    >
      <form onSubmit={handleSubmit}>
        <div className="text-center mb-3">
          <p>Sign up with:</p>
          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-link btn-floating mx-1"
          >
            <i className="fab fa-facebook-f"></i>
          </button>

          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-link btn-floating mx-1"
          >
            <i className="fab fa-google"></i>
          </button>

          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-link btn-floating mx-1"
          >
            <i className="fab fa-twitter"></i>
          </button>

          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-link btn-floating mx-1"
          >
            <i className="fab fa-github"></i>
          </button>
        </div>

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
            <span className="errorMsg">{input.errorMessage}</span>
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
