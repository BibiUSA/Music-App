import { useContext, useEffect, useState } from "react";
import TileOwner from "../../components/TileOwner";
import BottomTile from "../../components/BottomTile";

import context from "../../contexts/auth/context";
import axios from "axios";
import RegularVideoForTile from "../../components/RegularVideoForTile";
import "./RegularFeed.css";
import RegularTile from "../../components/RegularTile";

export default function RegularFeed() {
  const [fullData, setFullData] = useState([]);
  const [videoNum, setVideoNum] = useState(0);
  const [currentVideo, setCurrentVideo] = useState({
    id: "zLalOBFg498",
    startTime: 59,
    endTime: 83,
  });
  const [nextVideo, setNextVideo] = useState({
    id: "zLalOBFg498",
    startTime: 59,
    endTime: 83,
  });
  const [offset, setOffset] = useState(0);
  const { user } = useContext(context);
  const [shouldRender, setShouldRender] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [nextRender, setNextRender] = useState(false);
  const [counter, setCounter] = useState(0);
  //   const startingTime = link.startTime
  //   const endingTime = useState(link.endTime);
  console.log("currentvideo", currentVideo);
  console.log("API call count", counter);

  const getVideos = async (passedOffset) => {
    setCounter((prev) => prev + 1);
    try {
      const result = await axios.get("/get/homevideo", {
        params: {
          user: user.displayName,
          offset: passedOffset,
        },
      });
      if (fullData.length > 1) {
        //console.log("fulldata", fullData);
        let newArr = fullData.slice(-5);
        console.log(newArr);
        console.log(result.data.rows);
        if (newArr[0].tile_id == result.data.rows[0].tile_id) {
          return;
        } else {
          setFullData((prev) => [...prev, ...result.data.rows]);
        }
      } else if (fullData.length == 0) {
        setFullData((prev) => [...prev, ...result.data.rows]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVideos(0);
  }, []);

  useEffect(() => {
    if (fullData.length == 0) {
      return;
    }
    setCurrentVideo((prevState) => ({
      ...prevState,
      id: fullData[videoNum].tile_link,
      startTime: fullData[videoNum].starttime,
      endTime: fullData[videoNum].endtime,
    }));
  }, [videoNum]);

  useEffect(() => {
    if (fullData.length == 0) {
      return;
    }
    setCurrentVideo((prevState) => ({
      ...prevState,
      id: fullData[videoNum].tile_link,
      startTime: fullData[videoNum].starttime,
      endTime: fullData[videoNum].endtime,
    }));
    // setNextVideo((prevState) => ({
    //   ...prevState,
    //   id: fullData[videoNum + 1].tile_link,
    //   startTime: fullData[videoNum + 1].starttime,
    //   endTime: fullData[videoNum + 1].endtime,
    // }));
    setTimeout(setShouldRender(true), 1000);
  }, [fullData.length >= 2]);

  console.log("fulldata", fullData);
  console.log("CURRENT VIDEO", currentVideo);
  // console.log("LINK", link);

  const nextUp = () => {
    // setCurrentVideo(nextVideo);
    if (fullData.length - videoNum < 3) {
      getVideos(offset + 5);
      setOffset((prev) => prev + 5);
    }
    setVideoNum((prev) => prev + 1);

    // setNextVideo((prevState) => ({
    //   ...prevState,
    //   id: fullData[videoNum + 1].tile_link,
    //   startTime: fullData[videoNum + 1].starttime,
    //   endTime: fullData[videoNum + 1].endtime,
    // }));
    setRenderKey((prev) => prev + 1);
  };

  const previousVideo = () => {
    // setCurrentVideo((prevState) => ({
    //   ...prevState,
    //   id: fullData[videoNum - 1].tile_link,
    //   startTime: fullData[videoNum - 1].starttime,
    //   endTime: fullData[videoNum - 1].endtime,
    // }));
    // setNextVideo((prevState) => ({
    //   ...prevState,
    //   id: fullData[videoNum].tile_link,
    //   startTime: fullData[videoNum].starttime,
    //   endTime: fullData[videoNum].endtime,
    // }));
    setVideoNum((prev) => prev - 1);

    setRenderKey((prev) => prev - 1);
  };

  return (
    <div className="regularFeed">
      {fullData.length > 0 && <TileOwner data={fullData[videoNum]} />}
      {fullData.length > 0 && (
        <div>
          <button onClick={() => previousVideo()}>PREV</button>
          <button onClick={() => nextUp()}>NEXT</button>
        </div>
      )}
      {shouldRender && (
        <>
          <RegularTile
            key={renderKey}
            id={fullData[videoNum].tile_link}
            startTime={fullData[videoNum].starttime}
            endTime={fullData[videoNum].endtime}
          />
        </>
      )}

      {fullData.length > 0 && <BottomTile data={fullData[videoNum]} />}
    </div>
  );
}
