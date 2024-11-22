//page that contains signed in user's own info and feed
import "./Profile.css";
import ProfileInfo from "../../components/ProfileInfo";
import YourPosts from "../../components/YourPosts";
import "bootstrap/dist/css/bootstrap.min.css";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../Firebase";
import context from "../../contexts/auth/context";
import { useContext } from "react";

export default function Profile() {
  const { user } = useContext(context);
  return (
    <div className="profile">
      <ProfileInfo data={user} />
      <button
        type="button"
        onClick={() => {
          signOut(firebaseAuth);
          window.location = "/profile";
        }}
      >
        SignOut
      </button>
      <YourPosts />
    </div>
  );
}
