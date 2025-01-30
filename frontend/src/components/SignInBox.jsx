//Signing in box. Gives ability to sign in or register depending on what is needed.
import "./SignInBox.css";
import { useState } from "react";
import { firebaseApp, firebaseAuth } from "../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import SignIn from "./SignIn";
import Register from "./Register";

export default function SignInBox() {
  const [loginAria, setLoginAria] = useState(true); //decides which component is shown and color of checked box

 

  return (
    <div className="signIn">
      {/* <!-- Pills navs --> */}
      <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className={loginAria ? "nav-link active" : "nav-link "}
            id="tab-login"
            data-mdb-pill-init
            href="#pills-login"
            role="tab"
            aria-controls="pills-login"
            onClick={() => setLoginAria(true)}
            aria-selected={loginAria}
          >
            Login
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className={loginAria ? "nav-link" : "nav-link active"}
            id="tab-register"
            data-mdb-pill-init
            href="#pills-register"
            role="tab"
            aria-controls="pills-register"
            onClick={() => setLoginAria(false)}
            aria-selected={loginAria ? "false" : "true"}
          >
            Register
          </a>
        </li>
      </ul>
      {/* <!-- Pills navs --> */}

      {/* <!-- Pills content --> */}
      <div className="tab-content">{loginAria ? <SignIn /> : <Register />}</div>
      {/* <!-- Pills content --> */}
    </div>
  );
}
