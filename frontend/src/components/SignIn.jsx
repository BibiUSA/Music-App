//specifically for signing in and sending the signing in info to firebase
import { useState } from "react";
import { firebaseApp, firebaseAuth } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./SignIn.css";
import axios from "../config/axios";
import { useEffect } from "react";
import { signInGoogle, signInFacebook } from "../utils/SignInAuthentication";
import { useContext } from "react";
import context from "../contexts/auth/context";
import { useNavigate } from "react-router-dom";
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCheck, setEmailCheck] = useState("false");
  const [passwordCheck, setPasswordCheck] = useState("false");

  const auth = useContext(context);

  const navigate = useNavigate();
  useEffect(() => {
    if (auth.user) {
      navigate("/");
    }
  }, [auth.user]);

  console.log(auth);
  //Signing In Using email and password
  const firebaseSignIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        // Signed in
        lastLogInDate(userCredential.user.uid, new Date());
        console.log(userCredential.user);
        // ...
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const lastLogInDate = async (uid, date) => {
    try {
      const response = await axios.patch(`/user/logindate`, {
        uid: uid,
        date_login: date,
      });
      localStorage.setItem("uid", uid);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="tab-pane fade show active"
      id="pills-login"
      role="tabpanel"
      aria-labelledby="tab-login"
    >
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
      </div>

      {/* Google and facebook login */}
      <iframe
        onClick={signInGoogle}
        className="googleSignIn"
        src="https://developers.google.com/frame/identity/sign-in/web/demos/signin_contextual_custom.jshtml"
      ></iframe>

      <button onClick={signInFacebook}>Facebook</button>

      <form onSubmit={firebaseSignIn}>
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
            pattern="^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$"
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
