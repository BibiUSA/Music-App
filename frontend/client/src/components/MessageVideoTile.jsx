import { useEffect, useRef, useState, useContext } from "react";
import "./RegularVideo.css";
import axios from "axios";
import context from "../contexts/auth/context";

export default function MessageVideoTile(link) {
  const [startTime, setStartTime] = useState(link.startTime);
  const [endTime, setEndTime] = useState(link.endTime);

  console.log("LINk", link);

  let finalStartTime;
  let finalEndTime;

  if (link) {
    finalStartTime = startTime;
    finalEndTime = endTime;
  }

  const playerRef = useRef(null);
  const playerInstance = useRef(null);

  console.log("ENDTIME", finalEndTime);
  console.log("STARTTIME", finalStartTime);

  const loadPlayer = () => {
    if (playerInstance.current) {
      playerInstance.current.destroy();
    }

    playerInstance.current = new window.YT.Player(playerRef.current, {
      height: "390",
      width: "640",
      videoId: link.id,
      playerVars: {
        autoplay: 0,
        controls: 1,
        start: link.startTime,
        end: link.endTime,
      },
      events: {
        // onReady: (event) => event.target.playVideo(),
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            playerInstance.current.seekTo(startTime);
          }
        },
      },
    });
  };

  // Load API and player on mount
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        loadPlayer();
      };
    }

    return () => {
      if (playerInstance.current && playerInstance.current.destroy) {
        playerInstance.current.destroy();
      }
    };
  }, []); // Only load once

  // Reload player when times change
  //   useEffect(() => {
  //     if (window.YT && playerInstance.current?.loadVideoById) {
  //       playerInstance.current.loadVideoById({
  //         videoId: link.id,
  //         startSeconds: startTime,
  //         endSeconds: endTime,
  //       });
  //       setTimeout(() => {
  //         if (playerInstance.current) {
  //           playerInstance.current.seekTo(startTime);
  //           playerInstance.current.playVideo();
  //         }
  //       }, 300);
  //     }
  //   }, []);

  return (
    <div>
      <div className="youtubeVideo" ref={playerRef}></div>
    </div>
  );
}
