import axios from "../config/axios";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firebaseDb, firebaseAuth } from "../Firebase";
import { updateProfile } from "firebase/auth";

export default function useTotalSaveUser() {
  const navigate = useNavigate();

  const saveUser = async (firstName, lastName, email, uid, verifiedUsrName) => {
    try {
      const response = await axios.post("/user/save/", {
        fname: firstName,
        lname: lastName,
        email: email,
        username: verifiedUsrName,
        firebaseUID: uid,
        date_created: new Date(),
      });
      console.log(response);

      await updateProfile(firebaseAuth.currentUser, {
        displayName: verifiedUsrName,
      });

      await setDoc(doc(firebaseDb, "users", uid), {
        uid: uid,
        email: email,
        displayName: verifiedUsrName,
      });

      await setDoc(doc(firebaseDb, "userChats", uid), {});

      await setDoc(doc(firebaseDb, "unseenMessages", uid), {
        unseenMessage: 0,
      });

      await setDoc(doc(firebaseDb, "notifications", uid), {
        newFriendRequest: 0,
        newLikes: 0,
        likeNews: [],
        friendRequestNews: [],
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return { saveUser };
}
