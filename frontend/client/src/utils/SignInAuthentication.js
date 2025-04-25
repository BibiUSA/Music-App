import { firebaseApp, firebaseAuth } from "../Firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import axios from "../config/axios";
import { environment } from "../environment";

const provider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();

export function signInGoogle() {
  signInWithPopup(firebaseAuth, provider)
    .then((result) => {
      // console.log(FacebookAuthProvider.credentialFromResult(result));
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      environment.development && console.log(token);
      newUser(user).then(() => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        environment.development && console.log(user);
      });
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      // console.log(credential);
      environment.development && console.log(token);
      // console.log(user);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      environment.development && console.log(errorCode);
      environment.development && console.log(errorMessage);
      environment.development && console.log(email);
      environment.development && console.log(credential);
      // ...
    });
}

export async function signInFacebook() {
  signInWithPopup(firebaseAuth, fbProvider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
      newUser(user).then(() => {
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        environment.development && console.log(user);
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
    environment.development && console.log(result);
  } catch (error) {
    environment.development && console.log(error);
  }
};
