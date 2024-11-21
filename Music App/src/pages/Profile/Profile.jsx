//page that contains signed in user's own info and feed
import "./Profile.css";
import ProfileInfo from "../../components/ProfileInfo";
import YourPosts from "../../components/YourPosts";
import "bootstrap/dist/css/bootstrap.min.css";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../Firebase";

export default function Profile() {
  return (
    <div className="profile">
      <ProfileInfo />
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
