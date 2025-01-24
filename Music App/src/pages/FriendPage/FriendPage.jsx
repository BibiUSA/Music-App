import FriendProfile from "../../components/FriendProfile";
import YourPosts from "../../components/YourPosts";
import { useParams } from "react-router-dom";

export default function FriendPage() {
  const friendName = useParams();

  console.log("Friend", friendName);

  return (
    <div className="userPage">
      <FriendProfile />
      <YourPosts data={friendName} />
    </div>
  );
}
