//page that contains signed in user's own info and feed
import "./Profile.css";
import ProfileInfo from "../../components/ProfileInfo";
import YourPosts from "../../components/YourPosts";
import "bootstrap/dist/css/bootstrap.min.css";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../Firebase";
import context from "../../contexts/auth/context";
import { useContext, useState } from "react";
import Friends from "../../components/Friends";

export default function Profile() {
  const { user } = useContext(context);
  const [profileSelection, setProfileSelection] = useState("posts");

  if (!user) {
    window.location = "/login";
  }

  return (
    <div className="profile">
      <ProfileInfo data={user} />
      <div className="profileOptions">
        <div
          id="posts"
          className={
            profileSelection == "posts" ? "post-selected" : "post-unselected"
          }
          onClick={() => setProfileSelection("posts")}
        >
          Posts
        </div>
        <div
          id="friends"
          className={
            profileSelection == "friends"
              ? "friends-selected"
              : "friends-unselected"
          }
          onClick={() => setProfileSelection("friends")}
        >
          Friends
        </div>
      </div>

      {profileSelection == "posts" && user && <YourPosts />}
      {profileSelection == "friends" && user && <Friends />}
    </div>
  );
}
