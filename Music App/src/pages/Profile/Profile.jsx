//page that contains signed in user's own info and feed
import "./Profile.css";
import ProfileInfo from "../../components/ProfileInfo";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  return (
    <div className="profile">
      <ProfileInfo />
    </div>
  );
}
