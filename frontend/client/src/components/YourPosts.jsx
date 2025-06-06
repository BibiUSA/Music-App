import { useContext, useEffect, useRef, useState } from "react";
import TileOwner from "./TileOwner";
import BottomTile from "./BottomTile";

import context from "../contexts/auth/context";
import axios from "axios";
import "../pages/RegularFeed/RegularFeed.css";

import RegularTile from "./RegularTile";
import { isMobile } from "../utils/IsMobile";
import { Link } from "react-router-dom";

export default function YourPosts(data) {
  const [fullData, setFullData] = useState([]);
  const [videoNum, setVideoNum] = useState(0);
  const [sort, setSort] = useState("recent");
  const [offset, setOffset] = useState(0);
  const { user } = useContext(context);
  const [shouldRender, setShouldRender] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const [counter, setCounter] = useState(0);

  const feedPerson = data.data ? data.data.friend : user.displayName;
  // const [mobileNav, setMobileNav] = useState("navigate");

  console.log("FULLDATA", fullData);
  console.log("videoNum", videoNum);
  if (fullData.length > 0) {
    console.log("video link in parent", fullData[videoNum].tile_desc);
  }

  const fetchFeed = async (passedOffset, sort = "recent", refresh = false) => {
    setCounter((prev) => prev + 1);
    console.log("FULLDATA INSIDE", fullData);
    console.log("FEEDPERSON", feedPerson);
    try {
      const result = await axios.get(`/get/yourposts`, {
        params: {
          user: user.displayName,
          offset: passedOffset,
          sort: sort,
          feedPerson: feedPerson,
        },
      });
      console.log(result.data);
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

  //   const fetchFeed = async (passedOffset, sort = "magic", refresh = false) => {
  //     try {
  //       const response = await axios.get(`/get/yourposts`, {
  //         params: {
  //           offset: passedOffset,
  //           user: user.displayName,
  //           feedPerson: feedPerson,
  //           sort: sort,
  //         },
  //       });
  //       console.log(response);
  //       if (refresh == true) {
  //         setFullData(() => [...response.data.rows]);
  //       } else if (fullData.length > 1) {
  //         let newArr = fullData.slice(-5);
  //         if (newArr[0].tile_id == response.data.rows[0].tile_id) {
  //           return;
  //         } else {
  //           setFullData((prev) => [...prev, ...response.data.rows]);
  //         }
  //       } else {
  //         setFullData((prev) => [...prev, ...response.data.rows]);
  //       }

  //       // console.log(response.data.rows);
  //     } catch (error) {
  //       console.log("fetchFeed err", error);
  //     }
  //   };

  console.log(sort);
  useEffect(() => {
    fetchFeed(0), 1000;
  }, []);

  useEffect(() => {
    if (fullData.length == 0) {
      return;
    }

    setTimeout(setShouldRender(true), 1000);
  }, [fullData.length >= 1]);

  //to get the next video in queue
  const nextUp = () => {
    // setCurrentVideo(nextVideo);

    if (fullData.length - videoNum < 3) {
      fetchFeed(offset + 5, sort);
      setOffset((prev) => prev + 5);
    }
    if (videoNum == fullData.length - 1) {
      return;
    }

    setVideoNum((prev) => prev + 1);

    setRenderKey((prev) => prev + 1);
  };

  //get the previous video in queue
  const previousVideo = () => {
    setVideoNum((prev) => prev - 1);

    setRenderKey((prev) => prev - 1);
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
    fetchFeed(0, value, true);
    setOffset(0);

    // setFullData([]);
  };

  return (
    <div className="regularFeed">
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
      {isMobile() && (
        <div className="tile-navigation-mobile">
          {fullData.length > 0 &&
          fullData[0].tile_id != fullData[videoNum].tile_id ? (
            <button className="tile-nav-button" onClick={() => previousVideo()}>
              PREV
            </button>
          ) : (
            <button className="prev-non-active">PREV</button>
          )}
          {fullData.length &&
          fullData[fullData.length - 1].tile_id !=
            fullData[videoNum].tile_id ? (
            <button className="tile-nav-button" onClick={() => nextUp()}>
              NEXT
            </button>
          ) : (
            <button className="next-non-active">THE END</button>
          )}
        </div>
      )}
      {shouldRender && (
        <BottomTile key={renderKey + "a"} data={fullData[videoNum]} />
      )}
      {!isMobile() && fullData.length > 0 && (
        <div className="tile-navigation">
          {fullData[0].tile_id != fullData[videoNum].tile_id ? (
            <button className="tile-nav-button" onClick={() => previousVideo()}>
              PREV
            </button>
          ) : (
            <button className="prev-non-active">PREV</button>
          )}
          {fullData[fullData.length - 1].tile_id !=
          fullData[videoNum].tile_id ? (
            <button className="tile-nav-button" onClick={() => nextUp()}>
              NEXT
            </button>
          ) : (
            <button className="next-non-active">NEXT</button>
          )}
        </div>
      )}

      <div id="sort-options">
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
      </div>
    </div>
  );
}
