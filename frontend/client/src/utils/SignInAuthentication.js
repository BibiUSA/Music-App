import { firebaseApp, firebaseAuth } from "../Firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import axios from "../config/axios";

const fbProvider = new FacebookAuthProvider();

export const signInGoogle = async (e) => {
  e.preventDefault();
  console.log("HEre");
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    console.log(result);

    const user = result.user;

    // console.log(FacebookAuthProvider.credentialFromResult(result));
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    console.log(token);
    await newUser(user);

    console.log("Logged in with Google", user);

    // The signed-in user info.

    // IdP data available using getAdditionalUserInfo(result)
    // ...
    // console.log(credential);

    // console.log(user);
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode);
    console.log(errorMessage);
    console.log(email);
    console.log(credential);
    // ...
  }
};

export async function signInFacebook() {
  signInWithPopup(firebaseAuth, fbProvider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
      newUser(user).then(() => {
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        console.log(user);
      });
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.

      // newUser(user);

      //username, email,

      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);

      // ...
    });
}

const newUser = async (user) => {
  try {
    const result = await axios.post(`/user/newuser`, {
      email: user.email,
      uid: user.uid,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
