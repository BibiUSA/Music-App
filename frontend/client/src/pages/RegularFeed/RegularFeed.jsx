import { useContext, useEffect, useRef, useState } from "react";
import TileOwner from "../../components/TileOwner";
import BottomTile from "../../components/BottomTile";

import context from "../../contexts/auth/context";
import axios from "axios";
import RegularVideoForTile from "../../components/RegularVideoForTile";
import "./RegularFeed.css";
import RegularTile from "../../components/RegularTile";
import { isMobile } from "../../utils/IsMobile";
import { Link } from "react-router-dom";

export default function RegularFeed() {
  const [fullData, setFullData] = useState([]);
  const [videoNum, setVideoNum] = useState(0);
  const [sort, setSort] = useState("magic");
  const [offset, setOffset] = useState(0);
  const { user } = useContext(context);
  const [shouldRender, setShouldRender] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const [counter, setCounter] = useState(0);
  const [mobileNav, setMobileNav] = useState("navigate");

  console.log("FULLDATA", fullData);
  console.log("counter", counter);

  const getVideos = async (passedOffset, sort = "magic", refresh = false) => {
    setCounter((prev) => prev + 1);
    console.log("FULLDATA INSIDE", fullData);
    try {
      const result = await axios.get("/get/homevideo", {
        params: {
          user: user.displayName,
          offset: passedOffset,
          sort: sort,
        },
      });
      if (refresh == true || fullData.length == 0) {
        setFullData(() => [...result.data.rows]);
      } else if (fullData.length > 1) {
        //console.log("fulldata", fullData);
        let newArr = fullData[fullData.length - 5];
        console.log(newArr);
        // console.log(result.data.rows);
        if (newArr.tile_id == result.data.rows[0].tile_id) {
          return;
        } else {
          setFullData((prev) => [...prev, ...result.data.rows]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(sort);
  useEffect(() => {
    getVideos(0), 1000;
  }, []);

  useEffect(() => {
    if (fullData.length == 0) {
      return;
    }

    setTimeout(setShouldRender(true), 1000);
  }, [fullData.length >= 2]);

  //to get the next video in queue
  const nextUp = () => {
    // setCurrentVideo(nextVideo);

    if (fullData.length - videoNum < 3) {
      getVideos(offset + 5, sort);
      setOffset((prev) => prev + 5);
    }
    if (videoNum == fullData.length - 1) {
      return;
    }

    setVideoNum((prev) => prev + 1);

    setRenderKey((prev) => prev + 1);
    console.log("videoNum", videoNum);
  };

  //get the previous video in queue
  const previousVideo = () => {
    setVideoNum((prev) => prev - 1);

    setRenderKey((prev) => prev - 1);
    console.log("videoNum", videoNum);
  };

  //intented for mobile
  const mobileNavigationFun = (mobileNav, button) => {
    if (mobileNav == "navigate" && button == "prev") {
      previousVideo();
      setMobileNav("play");
    } else if (mobileNav == "navigate" && button == "next") {
      nextUp();
      setMobileNav("play");
    } else if (mobileNav == "play") {
      setMobileNav("navigate");
    }
  };

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.code == "ArrowLeft") {
        previousVideo();
      } else if (event.code == "ArrowRight") {
        nextUp();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
  }, []);

  //NEED TO PROBABLY FIX THIS SO VIDEO RENDERS CORRECTLY
  const newSort = (value) => {
    if (sort == value) {
      return;
    }
    setSort(value);
    setVideoNum(0);
    getVideos(0, value, true);
    setOffset(0);

    // setFullData([]);
  };

  return (
    <div className="regularFeed">
      <div>
        <button
          className={sort == "magic" ? "blue-sort-button" : "sort-button"}
          onClick={() => newSort("magic")}
        >
          Magic
        </button>
        <button
          className={sort == "recent" ? "blue-sort-button" : "sort-button"}
          onClick={() => newSort("recent")}
        >
          Recent
        </button>
        <button
          className={sort == "oldest" ? "blue-sort-button" : "sort-button"}
          onClick={() => newSort("oldest")}
        >
          Oldest
        </button>
        <button
          className={sort == "most-liked" ? "blue-sort-button" : "sort-button"}
          onClick={() => newSort("most-liked")}
        >
          Most Liked
        </button>
        {/* <button
          className={sort == "friends" ? "blue-sort-button" : "sort-button"}
          onClick={() => newSort("friends")}
        >
          Friends
        </button> */}
      </div>

      <Link to="/upload">
        <button className="btn btn-primary"> Upload</button>
      </Link>
      {fullData.length > 0 && <TileOwner data={fullData[videoNum]} />}

      {fullData.length > 0 && shouldRender && (
        <>
          <RegularTile
            key={renderKey}
            id={fullData[videoNum].tile_link}
            startTime={fullData[videoNum].starttime}
            endTime={fullData[videoNum].endtime}
          />
        </>
      )}

      {shouldRender && (
        <BottomTile key={renderKey + "a"} data={fullData[videoNum]} />
      )}
      {!isMobile() && fullData.length > 0 && (
        <div className="tile-navigation">
          <button onClick={() => previousVideo()}>PREV</button>
          <button onClick={() => nextUp()}>NEXT</button>
        </div>
      )}
      {isMobile() && (
        <div className="tile-navigation">
          <button onClick={() => mobileNavigationFun(mobileNav, "prev")}>
            {mobileNav == "navigate" ? "PREV" : "Play"}
          </button>
          <button onClick={() => mobileNavigationFun(mobileNav, "next")}>
            {mobileNav == "navigate" ? "NEXT" : "Play"}
          </button>
        </div>
      )}
    </div>
  );
}
