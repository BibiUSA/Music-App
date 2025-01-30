import FriendProfile from "../../components/FriendProfile";
import YourPosts from "../../components/YourPosts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FriendPage() {
  const friendName = useParams();

  console.log("Friend", friendName);

  return (
    <div className="friendPage">
      <FriendProfile />
      <YourPosts data={friendName} />
    </div>
  );
}
