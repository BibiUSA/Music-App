//Bottom part of the tile/post component. Contains buttons for liking, messaging
import "./BottomTile.css";
import {
  IconHeart,
  IconMessageUser,
  IconHeartFilled,
  IconDots,
} from "@tabler/icons-react";
import { useState, useEffect, useContext } from "react";
import context from "../contexts/auth/context";
import axios from "axios";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";

export default function BottomTile(data) {
  const [heart, setHeart] = useState(<IconHeart stroke={2} className="icon" />); //fills up the heart
  const [liked, setLiked] = useState("notLiked"); //just to see if its liked because comparing html value above is harder
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const { user } = useContext(context);
  const tileData = data.data;

  console.log("USER", user);
  console.log(tileData);

  useEffect(() => {
    if (tileData.username) {
      setLiked("liked");
      setHeart(<IconHeartFilled className="heart" />);
    }
  }, []);

  const changeHeart = () => {
    if (!user) {
      console.log("LOG IN PLEASE");
      setTimeout(function () {
        alert("Log in to like posts.");
      }, 1);
      return;
    }
    if (liked === "notLiked") {
      likePost(tileData.tile_id, user.displayName);
      // setLiked("liked");
      // setHeart(<IconHeartFilled className="heart" />);
    } else {
      unLikePost(tileData.tile_id, user.displayName);
    }
  };

  function handleChange(event) {
    setMessage(`${event}`);
  }

  const likePost = async (tile_id, username) => {
    try {
      const result = await axios.post(
        `http://localhost:8080/create/likepost/${tile_id}&${username}`
      );
      setLiked("liked");
      setHeart(<IconHeartFilled className="heart" />);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const unLikePost = async (tile_id, username) => {
    console.log(tile_id, username);
    try {
      const result = await axios.delete(
        `http://localhost:8080/create/unlikepost/${tile_id}&${username}`
      );
      setLiked("notLiked");
      setHeart(<IconHeart stroke={2} className="icon" />);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const reportPost = async () => {
    try {
      const result = await axios.post(`http://localhost:8080/create/report`, {
        tile_id: tileData.tile_id,
        username: user.displayName,
      });
      console.log(result);
      setShow((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async () => {
    console.log("delete this");
    setShow(false);
  };

  const edit = async () => {
    console.log("edit this");
    setShow(false);
  };

  //options to report or edit/delete posts
  const options = () => {
    if (user.displayName == tileData.tile_owner) {
      return (
        <div>
          <button className="user-buttons" onClick={edit}>
            Edit
          </button>
          <button className="user-buttons" onClick={deletePost}>
            Delete
          </button>
        </div>
      );
    } else {
      return (
        <button className="user-buttons" onClick={reportPost}>
          Report Post
        </button>
      );
    }
  };

  const handleOptions = () => {
    if (user) {
      setShow((prev) => !prev);
    } else {
      window.alert("log in for these features.");
    }
  };

  return (
    <div className="bottomTile">
      <DeletePost />
      {show && <div className="dialog_box bottom">{options()}</div>}
      <div className="icons">
        <div onClick={changeHeart}>{heart}</div>
        <IconMessageUser stroke={2} className="icon" />
        <IconDots stroke={2} className="icon" onClick={handleOptions} />
      </div>

      {/* shows how many likes a post have if the tile_owner is the signed in user */}
      {user ? (
        <div>
          {user.displayName == tileData.tile_owner ? (
            <p>LIKES: {tileData.tile_likes}</p>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      {/* For messaging in the future */}
      <input
        className="messageOwner"
        type="textarea"
        placeholder="Send Message"
        value={message}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
      ></input>
      {user.displayName === "hi" && (
        <div className="edit-post-box">
          <EditPost data={tileData} />
          <div className="buttons">
            <button type="button" className="btn btn-secondary">
              Cancel
            </button>
            <button type="button" className="btn btn-primary">
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
