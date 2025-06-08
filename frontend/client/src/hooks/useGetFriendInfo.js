import axios from "axios";

export const getFriendInfo = async (friendName, user) => {
  console.log("FRIEND", friendName);
  try {
    const response = await axios.get(`/user/friend`, {
      params: { friend: friendName, user: user.displayName },
    });
    console.log("FRIEND-INFO-api-call", response);
    return response.data.rows[0];
  } catch (error) {
    console.log(error);
  }
};
