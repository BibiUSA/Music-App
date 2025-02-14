import axios from "../config/axios";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firebaseDb, firebaseAuth } from "../Firebase";
import { updateProfile } from "firebase/auth";

export default function useTotalSaveUser() {
  const navigate = useNavigate();

  const saveUser = async (firstName, lastName, email, uid) => {
    try {
      const response = await axios.post("/user/save/", {
        fname: firstName,
        lname: lastName,
        email: email,
        firebaseUID: uid,
        date_created: new Date(),
      });
      console.log(response);

      await updateProfile(firebaseAuth.currentUser, {
        displayName: `user${uid.slice(0, 6)}`,
      });

      await await addDoc(collection(firebaseDb, "users", uid), {
        uid: uid,
        email: email,
        displayName: `user${uid.slice(0, 6)}`,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return { saveUser };
}
