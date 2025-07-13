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
  const [renderKey, setRenderKey] = useState(0);

  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [mobileNav, setMobileNav] = useState("navigate");

  console.log("FULLDATA", fullData);
  console.log("videoNum", videoNum);
  if (fullData.length > 0) {
    console.log("video link in parent", fullData[videoNum].tile_desc);
  }

  const getVideos = async (passedOffset, sort = "magic", refresh = false) => {
    setCounter((prev) => prev + 1);
    setLoading(true);
    console.log("FULLDATA INSIDE", fullData);
    try {
      const result = await axios.get("/get/homevideo", {
        params: {
          user: user ? user.displayName : 0,
          offset: passedOffset,
          sort: sort,
        },
      });
      console.log(result, "Vidoes Results");
      setLoading(false);
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

  useEffect(() => {
    getVideos(0), 1000;
  }, []);
  //to get the next video in queue
  const nextUp = async () => {
    if(loading) return;

    if (fullData.length - videoNum < 4) {
      await getVideos(offset + 5, sort);
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
    if(loading) return;
    if(videoNum === 0) return
    setVideoNum((prev) => prev - 1);
    setRenderKey((prev) => prev - 1);
  };

  useEffect(() => {
    function handleKeyDown(event) {
      event.preventDefault();
      if (event.code == "ArrowLeft") {
        previousVideo();
      } else if (event.code == "ArrowRight") {
        nextUp();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [videoNum, loading, sort]);

  //NEED TO PROBABLY FIX THIS SO VIDEO RENDERS CORRECTLY
  const newSort = async (value) => {
    if (sort == value) {
      return;
    }
    setSort(value);
    await getVideos(0, value, true);
    setVideoNum(0);
    setOffset(0);

    // setFullData([]);
  };

  return (
    <div className="regularFeed">
      <Link to={user ? "/upload" : "/login"}>
        <button className="btn btn-primary upload-video">
          {user ? `Upload` : `Log In To Share That Song You Like`}
        </button>
      </Link>

      {fullData.length > 0 && <TileOwner data={fullData[videoNum]} />}

      {fullData.length > 0 && (
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
      {fullData.length > 0 && (
        <BottomTile key={renderKey + "a"} data={fullData[videoNum]} />
      )}
      {!isMobile() && fullData.length > 0 && (
        <div className="tile-navigation">
          {fullData[0].tile_id != fullData[videoNum].tile_id ? (
            <button
              className="tile-nav-button"
              onClick={() => previousVideo()}
              disabled={loading || videoNum < 1}
            >
              PREV
            </button>
          ) : (
            <button className="prev-non-active">PREV</button>
          )}
          {fullData[fullData.length - 1].tile_id !=
            fullData[videoNum].tile_id ? (
            <button
              className="tile-nav-button"
              disabled={loading}
              onClick={() => nextUp()}
            >
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
        {user && (
          <button
            className={sort == "friends" ? "blue-sort-button" : "sort-button"}
            onClick={() => newSort("friends")}
          >
            Friends
          </button>
        )}
      </div>
    </div>
  );
}
