//Navigation bar
import {
  IconHome,
  IconMessages,
  IconUserCircle,
  IconBell,
  IconSearch,
} from "@tabler/icons-react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "../config/axios";
import SearchUser from "./SearchUser";
import OutsideClickHandler from "react-outside-click-handler";
import { useLocation } from "react-router-dom";
import { onSnapshot, doc } from "firebase/firestore";
import { firebaseDb } from "../Firebase";
import context from "../contexts/auth/context";
import Notification from "./Notification";

export default function Navbar() {
  const [searchWord, setSearchWord] = useState("");
  const [results, setResults] = useState([]);
  const [searchBox, setSearchBox] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [newMessage, setNewMessage] = useState([]);
  const [notification, setNotification] = useState([]);
  const [notificationWindow, setNotificationWindow] = useState(false);
  console.log(mobileSearch);
  const { user } = useContext(context);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(firebaseDb, "unseenMessages", user.uid),
        (doc) => {
          setNewMessage(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };
    user.uid && getChats();
  }, [user.uid]);

  useEffect(() => {
    const getNotifications = () => {
      const unSub = onSnapshot(
        doc(firebaseDb, "notifications", user.uid),
        (doc) => {
          doc.exists() &&
            setNotification([doc.data().newLikes, doc.data().newFriendRequest]);
        }
      );
      return () => {
        unSub();
      };
    };

    user.uid && getNotifications();
  }, [user.uid]);

  const search = async (event) => {
    setSearchWord(event.target.value);
    try {
      const response = await axios.get(`/user/search`, {
        params: { search: searchWord.trim() },
      });
      setResults(response.data.rows);
      console.log(response.data.rows);
    } catch (error) {
      console.log(error);
    }
  };

  const spread = results.map((item) => {
    return <SearchUser key={item.username} data={item} />;
  });

  //closes the notification window. Timeout set so that when clicked on notification icon agian, it doesn't keep reopening
  const closeNotification = (data) => {
    if (data == true) {
      setTimeout(() => {
        setNotificationWindow(false);
      }, [50]);
    }
  };

  return (
    <div className="navbar">
      <div
        className={mobileSearch ? "mobileSearchSection" : "searchingSection"}
        onFocus={() => {
          setSearchBox(true);
        }}
        // onBlur={() => {
        //   setSearchBox(false);
        // }}
      >
        <OutsideClickHandler
          onOutsideClick={() => {
            setSearchBox(false);
          }}
        >
          <input
            className={mobileSearch ? "mobileSearch" : "search"}
            type="text"
            placeholder="Search Users"
            value={searchWord}
            onChange={(event) => search(event)}
          ></input>
          {searchBox && (
            <div
              className="searchResults"
              onClick={() => {
                setSearchBox(false);
              }}
            >
              {spread}
            </div>
          )}
        </OutsideClickHandler>
      </div>
      <div className="links">
        <div
          className="search_icon"
          onClick={() => setMobileSearch(!mobileSearch)}
        >
          <IconSearch stroke={2} />
        </div>
        <Link to="/">
          <div className="icons">
            <IconHome stroke={2} />
          </div>
        </Link>
        <Link to="/messages">
          <div
            className={newMessage["unseenMessage"] > 0 ? "red-icon" : "icons"}
          >
            <IconMessages stroke={2} />
            <p className="mssg-notification">
              {newMessage["unseenMessage"] > 0 && newMessage["unseenMessage"]}
            </p>
          </div>
        </Link>
        {/* <div className="nav-right-icons"> */}
        {/* <div className="icons">
          <IconBell stroke={2} />
        </div> */}
        <Link
          onClick={() => {
            setNotificationWindow((prevState) => !prevState);
          }}
        >
          <div
            className={
              notification[0] + notification[1] > 0 ? "red-icon" : "icons"
            }
          >
            <IconUserCircle stroke={2} />
            <p className="mssg-notification">
              {notification[0] + notification[1] > 0 &&
                notification[0] + notification[1]}{" "}
            </p>
          </div>
        </Link>
        {notificationWindow && (
          <Notification closeNotificationWindow={closeNotification} />
        )}
        {/* </div> */}
      </div>
    </div>
  );
}
