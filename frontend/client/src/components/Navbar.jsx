//Navigation bar
import {
  IconHome,
  IconMessages,
  IconUserCircle,
  IconBell,
} from "@tabler/icons-react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "../config/axios";
import SearchUser from "./SearchUser";
import OutsideClickHandler from "react-outside-click-handler";

export default function Navbar() {
  const [searchWord, setSearchWord] = useState("");
  const [results, setResults] = useState([]);
  const [searchBox, setSearchBox] = useState(false);

  console.log("LINKNAME", window.location.href);

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
        className="searchingSection"
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
            className="search"
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

      <Link to="/">
        <div className="icons">
          <IconHome stroke={2} />
        </div>
      </Link>
      <Link to="/messages">
        <div className="icons">
          <IconMessages stroke={2} />
        </div>
      </Link>
      <div className="nav-right-icons">
        <div className="icons">
          <IconBell stroke={2} />
        </div>
        <Link to="/profile">
          <div className="icons">
            <IconUserCircle stroke={2} />
          </div>
        </Link>
      </div>
    </div>
  );
}
