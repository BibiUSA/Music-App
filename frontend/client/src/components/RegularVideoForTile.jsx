import { useContext, useEffect, useRef, useState } from "react";

import context from "../contexts/auth/context";
import axios from "axios";
import "./RegularVideoForTile.css";

export default function RegularVideoForTile(feedInfo) {
  const { user } = useContext(context);
  //   const startingTime = link.startTime
  //   const endingTime = useState(link.endTime);
  console.log(user);

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
        videoId: feedInfo.id,
        playerVars: {
          autoplay: 1,
          controls: 1,
          start: feedInfo.startTime,
          end: feedInfo.endTime,
        },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playerInstance.current.seekTo(feedInfo.startTime);
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
  }, [feedInfo.id]);
  // if (err) {
  //   return (
  //     <h3 className="text-danger">
  //       {err.data?.response?.message || err.message}
  //     </h3>
  //   );
  // }

  return (
    <div className="regularVideoForTile">
      <div className="youtubeVideo" ref={playerRef}></div>
    </div>
  );
}
