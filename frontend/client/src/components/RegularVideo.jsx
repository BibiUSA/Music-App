import { useEffect, useRef, useState } from "react";

export default function RegularVideo(link) {
  const [startTime, setStartTime] = useState({ minute: 0, seconds: 0 });
  const [endTime, setEndTime] = useState({ minute: 0, seconds: 10 });
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
  }, [finalStartTime, finalEndTime, link]);

  //   useEffect(() => {
  //     // Load YouTube IFrame API
  //     if (!window.YT) {
  //       const tag = document.createElement("script");
  //       tag.src = "https://www.youtube.com/iframe_api";
  //       const firstScriptTag = document.getElementsByTagName("script")[0];
  //       firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  //     }

  //     window.onYouTubeIframeAPIReady = () => {
  //       if (playerInstance.current) {
  //         playerInstance.current.destroy();
  //       }

  //       // Make the global function for YouTube API
  //       playerInstance.current = new window.YT.Player(playerRef.current, {
  //         height: "390",
  //         width: "640",
  //         videoId: IDforVideo,
  //         playerVars: {
  //           autoplay: 1,
  //           controls: 1,
  //           start: finalStartTime,
  //           end: finalEndTime,
  //         },
  //         events: {
  //           onReady: (event) => event.target.playVideo(),
  //           onStateChange: (event) => {
  //             if (event.data === window.YT.PlayerState.ENDED) {
  //               playerInstance.current.seekTo(finalEndTime);
  //             }
  //           },
  //         },
  //       });
  //     };

  //     //   }, []);

  //     return () => {
  //       // Cleanup
  //       if (playerInstance.current && playerInstance.current.destroy) {
  //         playerInstance.current.destroy();
  //       }
  //     };
  //   }, [startTime, endTime]);

  return (
    <div>
      <label>Enter Start Time</label>
      <input
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
      <label>Enter End Time</label>
      <input
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
      <br></br>
      <div ref={playerRef}></div>;
    </div>
  );
}
