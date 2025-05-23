import { useEffect, useRef, useState } from "react";

export default function RegularVideo(link) {
  //   const startingTime = link.startTime
  //   const endingTime = useState(link.endTime);
  console.log("LINK", link);
  let IDforVideo = "U8F5G5wR1mk";

  if (link) {
    IDforVideo = link.link;
  }

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
          start: link.startingTime,
          end: link.endTime,
        },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playerInstance.current.seekTo(link.startingTime);
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

  return <div ref={playerRef} />;
}
