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
import {
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
  getDoc,
  increment,
  setDoc,
} from "firebase/firestore";
import { firebaseDb } from "../Firebase";
import { v4 as uuidv4 } from "uuid";

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
    setMessage(`${event.target.value}`);
  }

  const likePost = async (tile_id, username) => {
    try {
      const result = await axios.post(
        `/create/likepost/${tile_id}&${username}`
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
        //adds message to their chat conversation
        await updateDoc(doc(firebaseDb, "chats", combinedId), {
          messages: arrayUnion({
            id: uuidv4(),
            text: message,
            tile: { id: tileData.tile_id, link: tileData.tile_link },
            senderId: user.uid,
            date: Timestamp.now(),
          }),
        });
        setMessage("");

        //Check to see if userChat between 2 users, especially the receiving user exists
        const docRef = doc(
          firebaseDb,
          "userChats",
          check.data.rows[0].firebase_uid
        );
        const res = await getDoc(docRef);

        //if it exists, check to see if "seen" exists and if seen is not false, set as false
        //and increment unseenMessage by 1
        if (res.exists()) {
          console.log("RAN");
          const data = res.data();
          const seen = data[combinedId]?.lastMessage?.seen;

          if (seen !== false) {
            const docRef2 = doc(
              firebaseDb,
              "unseenMessages",
              check.data.rows[0].firebase_uid
            );
            const res2 = await getDoc(docRef2);
            //IF MESSAGE NOTIFICATION HASN"T BEEN CREATED, create one
            if (!res2.exists()) {
              await setDoc(
                doc(
                  firebaseDb,
                  "unseenMessages",
                  check.data.rows[0].firebase_uid
                ),
                { unseenMessage: 1 }
              );
            } else {
              await updateDoc(
                doc(
                  firebaseDb,
                  "unseenMessages",
                  check.data.rows[0].firebase_uid
                ),
                {
                  unseenMessage: increment(1),
                }
              );
            }
          }
        } else {
          await setDoc(
            doc(firebaseDb, "unseenMessages", check.data.rows[0].firebase_uid),
            {
              unseenMessage: increment(1),
            }
          );
        }

        //so that if last message wasn't seen by the sender, it won't be marked as seen
        const docRef3 = doc(firebaseDb, "userChats", user.uid);
        const res3 = await getDoc(docRef3);

        if (res3.exists()) {
          const data = res3.data();
          const seen = data[combinedId]?.lastMessage?.seen;

          if (seen !== false) {
            await updateDoc(doc(firebaseDb, "userChats", user.uid), {
              [combinedId]: {
                userinfo: {
                  uid: check.data.rows[0].firebase_uid,
                  displayName: tileData.tile_owner,
                  photoUrl: tileData.img_url,
                },
                lastMessage: {
                  message,
                  seen: true,
                },
                date: serverTimestamp(),
              },
            });
          } else {
            await updateDoc(doc(firebaseDb, "userChats", user.uid), {
              [combinedId]: {
                userinfo: {
                  uid: check.data.rows[0].firebase_uid,
                  displayName: tileData.tile_owner,
                  photoUrl: tileData.img_url,
                },
                lastMessage: {
                  message,
                  seen: false,
                },
                date: serverTimestamp(),
              },
            });
          }
        }

        await updateDoc(
          doc(firebaseDb, "userChats", check.data.rows[0].firebase_uid),
          {
            [combinedId]: {
              userinfo: {
                uid: user.uid,
                displayName: user.displayName,
                photoUrl: user.photoURL,
              },
              lastMessage: {
                message,
                seen: false,
              },
              date: serverTimestamp(),
            },
          }
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
        <div onClick={changeHeart}>{heart}</div>
        <IconMessageUser
          stroke={2}
          className="icon"
          onClick={(tileData) => share(tileData)}
        />
        <IconDots stroke={2} className="icon" onClick={handleOptions} />
      </div>
      {shareState && <Share tileData={tileData} close={closeShare} />}

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
