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

export default function Navbar() {
  const [searchWord, setSearchWord] = useState("");
  const [results, setResults] = useState([]);
  const [searchBox, setSearchBox] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [newMessage, setNewMessage] = useState([]);
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

  console.log(newMessage["unseenMessage"]);

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
        <Link to="/profile">
          <div className="icons">
            <IconUserCircle stroke={2} />
          </div>
        </Link>
        {/* </div> */}
      </div>
    </div>
  );
}
