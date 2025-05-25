import { useEffect, useRef, useState, useContext } from "react";
import "./RegularVideo.css";
import axios from "axios";
import context from "../contexts/auth/context";

export default function RegularVideo(link) {
  const [startTime, setStartTime] = useState({ minute: 0, seconds: 0 });
  const [endTime, setEndTime] = useState({ minute: 0, seconds: 10 });
  const { user } = useContext(context);
  console.log("LINK", link);

  let IDforVideo = "U8F5G5wR1mk";

  if (link) {
    IDforVideo = link.link;
  }

  const playerRef = useRef(null);
  const playerInstance = useRef(null);

  let finalStartTime = startTime.minute * 60 + startTime.seconds;
  let tempEndTime = endTime.minute * 60 + endTime.seconds;
  let finalEndTime =
    finalStartTime < tempEndTime ? tempEndTime : finalStartTime + 10;

  console.log("ENDTIME", finalEndTime);
  console.log("STARTTIME", finalStartTime);

  const loadPlayer = () => {
    if (playerInstance.current) {
      playerInstance.current.destroy();
    }

    playerInstance.current = new window.YT.Player(playerRef.current, {
      height: "390",
      width: "640",
      videoId: IDforVideo || "U8F5G5wR1mk",
      playerVars: {
        autoplay: 1,
        controls: 1,
        start: finalStartTime,
        end: finalEndTime,
      },
      events: {
        onReady: (event) => event.target.playVideo(),
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            playerInstance.current.seekTo(finalStartTime);
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
  useEffect(() => {
    if (window.YT && playerInstance.current?.loadVideoById) {
      playerInstance.current.loadVideoById({
        videoId: IDforVideo || "U8F5G5wR1mk",
        startSeconds: finalStartTime,
        endSeconds: finalEndTime,
      });
      setTimeout(() => {
        if (playerInstance.current) {
          playerInstance.current.seekTo(finalStartTime);
          playerInstance.current.playVideo();
        }
      }, 300);
    }
  }, [finalStartTime, finalEndTime, link.link]);

  const sharePost = async (linked, desc) => {
    const date = new Date();

    if (desc.length < 1) {
      console.log("DEscription here", desc);
      console.log("look at desc", desc);
      return;
    }
    console.log(date);
    try {
      const result = await axios.post(`/create/newvideo`, {
        link: linked,
        description: desc,
        owner: user.displayName,
        date: date,
        startTime: finalStartTime,
        endTime: finalEndTime,
      });
      link.changeSuccess(true);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <section className="timeSection">
        <label>Enter Start Time</label>
        <p className="timeDesc">START</p>
        {/* <span>START</span> */}
        <div className="startTimes">
          <input
            className="startmin"
            type="number"
            min="0"
            placeholder="minute"
            onChange={(event) =>
              setStartTime((prevState) => ({
                ...prevState,
                minute: Number(event.target.value),
              }))
            }
          />
          <input
            className="startsec"
            type="number"
            min="0"
            max="59"
            placeholder="seconds"
            onChange={(event) =>
              setStartTime((prevState) => ({
                ...prevState,
                seconds: Number(event.target.value),
              }))
            }
          />
        </div>
      </section>
      <br></br>
      <section className="timeSection">
        <label>Enter End Time</label>
        <p className="timeDesc">END</p>
        <div className="endTimes">
          <input
            className="endmin"
            type="number"
            min="0"
            placeholder="minute"
            onChange={(event) =>
              setEndTime((prevState) => ({
                ...prevState,
                minute: Number(event.target.value),
              }))
            }
          />
          <input
            className="endsec"
            type="number"
            min="0"
            max="59"
            placeholder="seconds"
            onChange={(event) =>
              setEndTime((prevState) => ({
                ...prevState,
                seconds: Number(event.target.value),
              }))
            }
          />
        </div>
      </section>
      <br></br>
      <div className="youtubeVideo" ref={playerRef}></div>
      <button
        type="submit"
        className="submit"
        onClick={() => {
          sharePost(link.link, link.description);
        }}
      >
        Share
      </button>
      ;
    </div>
  );
}
