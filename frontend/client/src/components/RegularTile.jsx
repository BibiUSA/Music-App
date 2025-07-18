import { useEffect, useRef, useState, useContext } from "react";
import "./RegularVideo.css";
import axios from "axios";
import context from "../contexts/auth/context";
import { isMobile } from "../utils/IsMobile";
import "./RegularTile.css";

export default function RegularTile(link) {
  const [startTime, setStartTime] = useState(link.startTime);
  const [endTime, setEndTime] = useState(link.endTime);
  const [showButton, setShowButton] = useState(true);

  console.log("LINk", link);

  let IDforVideo = "U8F5G5wR1mk";
  let finalStartTime;
  let finalEndTime;

  if (link) {
    IDforVideo = link.link;
    finalStartTime = startTime;
    finalEndTime = endTime;
  }
  console.log("child link ", link.link);

  const playerRef = useRef(null);
  const playerInstance = useRef(null);

  // console.log("ENDTIME", finalEndTime);
  // console.log("STARTTIME", finalStartTime);

  const loadPlayer = () => {
    if (playerInstance.current) {
      playerInstance.current.destroy();
    }

    playerInstance.current = new window.YT.Player(playerRef.current, {
      height: "390",
      width: "640",
      videoId: link.id,
      playerVars: {
        autoplay: 1,
        controls: 1,
        start: link.startTime,
        end: link.endTime,
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
  }, [link.id]); // Only load once

  // Reload player when times change
  useEffect(() => {
    if (window.YT && playerInstance.current?.loadVideoById) {
      playerInstance.current.loadVideoById({
        videoId: link.id,
        startSeconds: startTime,
        endSeconds: endTime,
      });
      setTimeout(() => {
        if (playerInstance.current) {
          playerInstance.current.seekTo(startTime);
          playerInstance.current.playVideo();
        }
      }, 300);
    }
  }, [link.link, finalStartTime, finalEndTime]);

  const playTheVideo = () => {
    playerInstance.current.playVideo();
    setShowButton(false);
  };

  return (
    <div>
      <div className="youtubeVideo" ref={playerRef}></div>

      {isMobile() && showButton && (
        <div className="play-button-div">
          <button
            className="playTheVideo"
            onClick={() => {
              playTheVideo();
            }}
          >
            play
          </button>
        </div>
      )}
    </div>
  );
}
