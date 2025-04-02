import FriendProfile from "../../components/FriendProfile";
import YourPosts from "../../components/YourPosts";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import context from "../../contexts/auth/context";

export default function FriendPage() {
  const { user } = useContext(context);

  if (!user) {
    window.location = "/login";
  }

  const friendName = useParams();

  console.log("Friend", friendName);

  return (
    <div className="friendPage">
      <FriendProfile />
      <YourPosts data={friendName} />
    </div>
  );
}
