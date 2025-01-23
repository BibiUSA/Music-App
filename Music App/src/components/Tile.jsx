//Has the posters name which is in TileOwner, and the youtube clip video. Keeps track off playing and pausing video
import TileOwner from "./TileOwner";
import BottomTile from "./BottomTile";
import "./Tile.css";
import { useEffect, useRef, useState } from "react";
import classes from "./tile.module.css";

export default function Tile(data) {
  const iframeRef = useRef(null);
  const pauseButtonRef = useRef(null);
  const [isVisible, setIsVisible] = useState();
  const [tileData, setTile] = useState(data.data);
  console.log(tileData);

  //if state is visible, play the video, or else pause
  //may not need this
  if (isVisible == true) {
    playVideo();
  } else if (isVisible == false) {
    pauseVideo();
  }

  const videoEmbed = `${tileData.tile_link}&enablejsapi=1`;
  // ("https://www.youtube.com/embed/hX0aI5Jz8i8?si=kMQJ5wV5HQ_a4Ghu&amp;clip=UgkxcHRk8al08naF9QQZjqjv27cnSwhdO1Ta&amp;clipt=EPDfBBiI1QU&enablejsapi=1");

  function pauseVideo() {
    iframeRef.current.contentWindow.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
    // console.log(pauseButtonRef.current.getBoundingClientRect());
  }

  //checks to see if the Ref is on the screen and plays the video if it is
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      // setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting == true) {
        playVideo();
      } else if (entry.isIntersecting == false) {
        pauseVideo();
      }
      // console.log("entry", entry);
    });
    observer.observe(pauseButtonRef.current);
    // return () => observer.disconnect();
    // console.log("pauseButton", pauseButtonRef.current);
  }, []);

  function playVideo() {
    iframeRef.current.contentWindow.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
    // const coordinate = iframeRef.getBoundingClientREct();
    // console.log(coordinate);
  }

  return (
    <div className={classes.root}>
      <TileOwner data={tileData} />
      {/* <button onClick={playVideo}>Play</button> */}
      {/* used to measure if video is on screen */}
      <div className="bar" ref={pauseButtonRef}></div>
      <div className={classes.videoWrapper}>
        <div>
          <iframe
            ref={iframeRef}
            className={classes.video}
            width="896"
            height="504"
            src={videoEmbed}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <BottomTile data={tileData} setTile={setTile} />
      {/* <button onClick={pauseVideo}>Pause</button> */}
    </div>
  );
}
