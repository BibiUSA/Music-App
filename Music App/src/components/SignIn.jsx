//specifically for signing in and sending the signing in info to firebase
import { useState } from "react";
import { firebaseApp, firebaseAuth } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./SignIn.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCheck, setEmailCheck] = useState("false");
  const [passwordCheck, setPasswordCheck] = useState("false");

  const firebaseSignIn = (e) => {
    e.preventDefault();
    if (email.length < 5 || password.length < 6) {
      console.log("Enter email and password");
      return;
    }
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        // Signed in

        console.log(userCredential);
        // ...
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div
      className="tab-pane fade show active"
      id="pills-login"
      role="tabpanel"
      aria-labelledby="tab-login"
    >
      <form onSubmit={firebaseSignIn}>
        <div className="text-center mb-3">
          <p>Sign in with:</p>
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

        {/* <!-- Email input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input
            required
            type="email"
            id="loginName"
            className="form-control"
            placeholder="email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            check={emailCheck}
            onBlur={() => setEmailCheck("true")}
          />
          <span className="errMsg">Please enter a valid email.</span>
          <label className="form-label" htmlFor="loginName">
            Username or Email
          </label>
        </div>

        {/* <!-- Password input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input
            required
            type="password"
            placeholder="password"
            id="loginPassword"
            className="form-control"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            check={passwordCheck}
            onBlur={() => setPasswordCheck("true")}
          />
          <span className="errMsg">
            Requirements: at least 1 digit, 1 special character from !@#$%^&*,
            6-16 characters long
          </span>
          <label className="form-label" htmlFor="loginPassword">
            Password
          </label>
        </div>

        {/* <!-- 2 column grid layout --> */}
        <div className="row mb-4">
          <div className="col-md-6 d-flex justify-content-center">
            {/* <!-- Simple link --> */}
            <a href="#!">Forgot password?</a>
          </div>
        </div>

        {/* <!-- Submit button --> */}
        <button
          type="submit"
          data-mdb-button-init
          data-mdb-ripple-init
          className="btn btn-primary btn-block mb-4"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
