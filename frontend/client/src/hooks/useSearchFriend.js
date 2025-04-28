import axios from "../config/axios";
import { useState, useEffect } from "react";

export default function useSearchFriend() {
  const [friendMatch, setFriendMatch] = useState([]);

  const searchFriend = async (search, user) => {
    try {
      const result = await axios.get("/user/searchfriend", {
        params: { search: search, user: user },
      });
      setFriendMatch(result.data.rows);
      console.log(result.data.rows);
    } catch (error) {
      console.log(error);
    }
  };
  return { friendMatch, searchFriend };
}
