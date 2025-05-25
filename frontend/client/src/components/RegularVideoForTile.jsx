import { useContext, useEffect, useRef, useState } from "react";
import TileOwner from "./TileOwner";
import BottomTile from "./BottomTile";
import useGetVideo from "../hooks/useGetVideo";
import context from "../contexts/auth/context";
import axios from "axios";

export default function RegularVideoForTile() {
  const [fullData, setFullData] = useState([]);
  const { user } = useContext(context);
  //   const startingTime = link.startTime
  //   const endingTime = useState(link.endTime);
  console.log(user);

  const { err, loading, get } = useGetVideo({
    api: "get/",
    params: user ? { offset: 0, user: user.displayName } : { offset: 0 },
    // deps: [offset],
    cb: (res) => {
      //part of this might have been built to deal with StrictMode
      if (fullData.length > 1) {
        //console.log("fulldata", fullData);
        let newArr = fullData.slice(-2);
        if (newArr[0].tile_id == res.data.rows[0].tile_id) {
          return;
        } else {
          setFullData((prev) => [...prev, ...res.data.rows]);
        }
      } else {
        //console.log("fulldata", res.data.rows);
        setFullData((prev) => [...prev, ...res.data.rows]);
      }
    },
  });

  useEffect(() => {
    get();
  }, []);
  // const getVideoData = async () => {
  //   try {
  //     const result = await axios.get("/get/homevideo", {
  //       params: {
  //         user: user.displayName,
  //         offset: 0,
  //       },
  //     });

  //     console.log("result", result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // getVideoData();

  console.log("fulldata", fullData);
  // console.log("LINK", link);

  let IDforVideo = "zLalOBFg498";
  let startTime = 59;
  let endTime = 83;

  if (fullData.length > 0) {
    IDforVideo = fullData[0].tile_link;
    startTime = fullData[0].starttime;
    endTime = fullData[0].endtime;
  }

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
        videoId: IDforVideo,
        playerVars: {
          autoplay: 1,
          controls: 1,
          start: startTime,
          end: endTime,
        },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playerInstance.current.seekTo(startTime);
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
  }, []);
  // if (err) {
  //   return (
  //     <h3 className="text-danger">
  //       {err.data?.response?.message || err.message}
  //     </h3>
  //   );
  // }

  return (
    <div className="regularVideoForTile">
      {fullData.length > 0 && <TileOwner data={fullData[0]} />}
      <div className="youtubeVideo" ref={playerRef}></div>;
      {fullData.length > 0 && <BottomTile data={fullData[0]} />}
    </div>
  );
}
