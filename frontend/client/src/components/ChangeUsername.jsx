import axios from "../config/axios";
import { firebaseAuth } from "../Firebase";
import { updateProfile } from "firebase/auth";
import { useContext } from "react";
import context from "../contexts/auth/context";
import { firebaseDb } from "../Firebase";
import { updateDoc, doc } from "firebase/firestore";

export default function ChangeUsername(data) {
  const { user } = useContext(context);
  console.log(user);
  const usernameDate = data.data.username_change_d;

  const timeSince = (past, today) => {
    if (!past) {
      return true;
    }
    let thatDay = new Date(past).getTime();
    let thisDay = today.getTime();
    let difference = thatDay - thisDay;
    difference = difference / (1000 * 3600 * 24);
    if (difference >= 7) {
      return true;
    } else {
      return false;
    }
  };

  const ready = timeSince(usernameDate, new Date());
  console.log(ready);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.target[0].value);
    usernameExists(event.target[0].value);
  };

  const usernameExists = async (username) => {
    try {
      const result = await axios.get(`/user/check`, {
        params: { username: username },
      });
      console.log(result.data.rows[0].count);
      if (result.data.rows[0].count == 1) {
        window.alert("already taken");
      } else {
        sentUserName(username);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sentUserName = (username) => {
    updateProfile(firebaseAuth.currentUser, {
      displayName: username,
    })
      .then(() => {
        updateUsername(username, user.uid);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateUsername = async (username, uid) => {
    try {
      const result = await axios.patch(`/user/username`, {
        username: username,
        uid: uid,
        date: new Date(),
        // .toISOString().slice(0, 19).replace("T", " "),
      });
      console.log("finished", username, uid, result);
      changeUsernameFirebase(username, uid);
    } catch (error) {
      console.log(error);
    }
  };

  //adds the data to firestore so that it can be updated for messaging
  const changeUsernameFirebase = async (username, uid) => {
    try {
      const userRef = doc(firebaseDb, "users", uid);
      await updateDoc(userRef, {
        displayName: username,
      });
      console.log("username is now ", username);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div></div>
    // <button>Username Change Coming Soon</button>
    // <form onSubmit={(event) => handleSubmit(event)}>
    //   {ready && (
    //     <div>
    //       <input
    //         type="text"
    //         name="username"
    //         pattern="^[a-zA-Z0-9][a-zA-Z0-9._]{1,13}[a-zA-Z0-9]$"
    //       ></input>
    //       <button type="submit">Confirm Username</button>
    //     </div>
    //   )}
    //   <br></br>
    //   {ready ? (
    //     <span>{"Choose wisely.Must can't change username again."} </span>
    //   ) : (
    //     <span> </span>
    //   )}
    // </form>
  );
}
