import { useContext, useEffect, useRef, useState } from "react";
import TileOwner from "./TileOwner";
import BottomTile from "./BottomTile";
import useGetVideo from "../hooks/useGetVideo";
import context from "../contexts/auth/context";
import axios from "axios";

export default function RegularVideoForTile() {
  const [fullData, setFullData] = useState([]);
  const [videoNum, setVideoNum] = useState(0);
  const [currentVideo, setCurrentVideo] = useState({
    id: "zLalOBFg498",
    startTime: 59,
    endTime: 83,
  });
  const [offset, setOffset] = useState(0);
  const { user } = useContext(context);
  //   const startingTime = link.startTime
  //   const endingTime = useState(link.endTime);
  console.log(user);

  const getVideos = async () => {
    try {
      const result = await axios.get("/get/homevideo", {
        params: {
          user: user.displayName,
          offset: offset,
        },
      });
      console.log(result.data.rows);
      setFullData((prev) => [...prev, ...result.data.rows]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVideos();
  }, [offset]);

  useEffect(() => {
    if (fullData.length == 0) {
      return;
    }
    setCurrentVideo((prevState) => ({
      ...prevState,
      id: fullData[videoNum].tile_link,
      startTime: fullData[videoNum].startTime,
      endTime: fullData[videoNum].endTime,
    }));
  }, [fullData.length == 2]);

  console.log("fulldata", fullData);
  // console.log("LINK", link);

  let IDforVideo = "zLalOBFg498";
  let startTime = 59;
  let endTime = 83;

  // if (fullData.length > 0) {
  //   IDforVideo = fullData[videoNum].tile_link;
  //   startTime = fullData[videoNum].starttime;
  //   endTime = fullData[videoNum].endtime;
  // }

  console.log(IDforVideo, startTime, endTime);
  const playerRef = useRef(null);
  const playerInstance = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Make the global function for YouTube API
    window.onYouTubeIframeAPIReady = () => {
      playerInstance.current = new window.YT.Player(playerRef.current, {
        height: "390",
        width: "640",
        videoId: currentVideo.id,
        playerVars: {
          autoplay: 1,
          controls: 1,
          start: currentVideo.startTime,
          end: currentVideo.endTime,
        },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playerInstance.current.seekTo(currentVideo.startTime);
            }
          },
        },
      });
    };

    //   }, []);

    return () => {
      // Cleanup
      if (playerInstance.current && playerInstance.current.destroy) {
        playerInstance.current.destroy();
      }
    };
  }, [currentVideo.id]);
  // if (err) {
  //   return (
  //     <h3 className="text-danger">
  //       {err.data?.response?.message || err.message}
  //     </h3>
  //   );
  // }

  return (
    <div className="regularVideoForTile">
      {fullData.length > 0 && <TileOwner data={fullData[videoNum]} />}
      <div className="youtubeVideo" ref={playerRef}></div>;
      {fullData.length > 0 && <BottomTile data={fullData[videoNum]} />}
    </div>
  );
}
