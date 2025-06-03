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
import axios from "../config/axios";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";
import Share from "./Share";
import { sendAMessage, setSeenLastMssgTime } from "../Services/firebaseCalls";
import { updateLikesNotification } from "../Services/firebaseCalls";

export default function BottomTile(data) {
  const [heart, setHeart] = useState(<IconHeart stroke={2} className="icon" />); //fills up the heart
  const [liked, setLiked] = useState("notLiked"); //just to see if its liked because comparing html value above is harder
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false); //to show reporting option
  const [showDel, setShowDel] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [report, setReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const [shareState, setShareState] = useState(false);
  const { user } = useContext(context);
  const tileData = data.data;

  //console.log("USER", user);
  console.log(tileData);

  useEffect(() => {
    if (tileData.username) {
      setLiked("liked");
      setHeart(<IconHeartFilled className="heart" />);
    }
  }, []);

  const changeHeart = async () => {
    console.log("like status");
    if (!user) {
      console.log("LOG IN PLEASE");
      setTimeout(function () {
        alert("Log in to like posts.");
      }, 1);
      return;
    }
    if (liked === "notLiked") {
      console.log("liked");
      await likePost(tileData.tile_id, user.displayName);
      const check = await axios.get(`user/uid`, {
        params: {
          tile_owner: tileData.tile_owner,
        },
      });

      await updateLikesNotification(
        user.displayName,
        check.data.rows[0].firebase_uid
      );
    } else {
      await unLikePost(tileData.tile_id, user.displayName);
    }
  };

  function handleChange(event) {
    setMessage(`${event.target.value}`);
  }

  const likePost = async (tile_id, username) => {
    console.log("ran here");
    try {
      const result = await axios.post(
        `/create/likepost/${tile_id}&${username}`
      );
      setLiked("liked");
      setHeart(<IconHeartFilled className="heart" />);
      console.log("liked done", result);
    } catch (error) {
      console.log(error);
    }
  };

  const unLikePost = async (tile_id, username) => {
    console.log(tile_id, username);
    try {
      const result = await axios.delete(
        `/create/unlikepost/${tile_id}&${username}`
      );
      setLiked("notLiked");
      setHeart(<IconHeart stroke={2} className="icon" />);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  //creates the box to write reason for report
  const writeReport = () => {
    setShow((prev) => !prev);
    setReport(true);
  };

  const reportPost = async () => {
    try {
      const result = await axios.post(`/create/report`, {
        tile_id: tileData.tile_id,
        username: user.displayName,
        reason: reportText,
      });
      console.log(result);
      setReport(false);
      setReportText("");
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async () => {
    setShow(false);
    setShowDel(true);
  };

  const edit = async () => {
    console.log("edit this");
    setShow(false);
    setShowEdit((prev) => !prev);
  };

  //options to report or edit/delete posts
  const options = () => {
    if (user.displayName == tileData.tile_owner) {
      return (
        <div>
          <button className="user-buttons" id="edit-user-button" onClick={edit}>
            Edit
          </button>
          <button
            className="user-buttons"
            id="delete-user-button"
            onClick={deletePost}
          >
            Delete
          </button>
        </div>
      );
    } else {
      return (
        <button className="user-buttons" onClick={writeReport}>
          Report Post
        </button>
      );
    }
  };

  const handleOptions = () => {
    if (user) {
      setShow((prev) => !prev);
      setShowDel(false);
      setShowEdit(false);
    } else {
      window.alert("log in for these features.");
    }
  };

  //check to see if tile_owner and user are friends. if so, send message
  const sendMessage = async (message) => {
    try {
      const response = await axios.get(`user/checkfriendship`, {
        params: {
          sender: user.displayName,
          tile_owner: tileData.tile_owner,
        },
      });
      console.log(response.data.rows[0].exists);
      if (response.data.rows[0].exists) {
        const check = await axios.get(`user/uid`, {
          params: {
            tile_owner: tileData.tile_owner,
          },
        });
        console.log(check.data.rows[0].firebase_uid);
        const combinedId =
          check.data.rows[0].firebase_uid > user.uid
            ? check.data.rows[0].firebase_uid + user.uid
            : user.uid + check.data.rows[0].firebase_uid;

        //from firebaseCalls.js
        sendAMessage(combinedId, message, user.uid, {
          id: tileData.tile_id,
          link: tileData.tile_link,
        });

        setSeenLastMssgTime(
          "userChats",
          check.data.rows[0].firebase_uid,
          true,
          combinedId,
          check.data.rows[0].firebase_uid,
          tileData.tile_owner,
          tileData.img_url,
          user.uid,
          user.displayName,
          user.photoURL,
          message,
          "no"
        );
        setMessage("");
      } else {
        setMessage("NOT FRIENDS");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const share = (tileData) => {
    setShareState(true);
  };

  const closeShare = () => {
    setShareState(false);
  };

  return (
    <div className="bottomTile">
      {showDel && <DeletePost data={tileData} setShowDel={setShowDel} />}
      {show && <div className="dialog_box bottom">{options()}</div>}
      <div className="icons">
        <div onClick={changeHeart}>
          {heart}
          {user && user.displayName == tileData.tile_owner ? (
            <span className="like_num">LIKES: {tileData.tile_likes}</span>
          ) : (
            <></>
          )}
        </div>

        <IconMessageUser
          stroke={2}
          className="icon"
          onClick={(tileData) => share(tileData)}
        />
        <IconDots stroke={2} className="icon" onClick={handleOptions} />
      </div>
      {shareState && <Share tileData={tileData} close={closeShare} />}

      {/* shows how many likes a post have if the tile_owner is the signed in user */}

      {/* For messaging in the future */}
      <input
        className="messageOwner"
        type="textarea"
        placeholder="Send Message"
        value={message}
        onChange={(event) => {
          handleChange(event);
        }}
        onKeyPress={(event) => {
          if (event.key == "Enter") {
            sendMessage(message);
          }
        }}
      ></input>
      {showEdit && <EditPost data={tileData} setShowEdit={setShowEdit} />}

      {report && (
        <div className="reportBox">
          <textarea
            className="reportText"
            value={reportText}
            onChange={(event) => {
              setReportText(event.target.value);
            }}
          ></textarea>
          <div className="reportButtons">
            <button onClick={() => setReport(false)} className="cancelReport">
              Cancel
            </button>
            <button className="sendReport" onClick={reportPost}>
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
