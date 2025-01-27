import axios from "axios";
import { firebaseAuth } from "../Firebase";
import { updateProfile } from "firebase/auth";
import { useContext } from "react";
import context from "../contexts/auth/context";

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
      const result = await axios.get(
        `https://music-app-api-oq6b.onrender.com/user/check`,
        {
          params: { username: username },
        }
      );
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
      const result = await axios.patch(
        `https://music-app-api-oq6b.onrender.com/user/username`,
        {
          username: username,
          uid: uid,
          date: new Date(),
          // .toISOString().slice(0, 19).replace("T", " "),
        }
      );
      console.log("finished", username, uid, result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      {ready && (
        <div>
          <input
            type="text"
            name="username"
            pattern="^[a-zA-Z0-9][a-zA-Z0-9._]{1,13}[a-zA-Z0-9]$"
          ></input>
          <button type="submit">Confirm Username</button>
        </div>
      )}
      <br></br>
      {ready ? (
        <span>Must wait for 7 days after change to make changes again. </span>
      ) : (
        <span>Need to wait more to update. Only one update per week </span>
      )}
    </form>
  );
}
