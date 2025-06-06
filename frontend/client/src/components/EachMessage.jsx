import "./EachMessage.css";
import context from "../contexts/auth/context";
import { useContext, useState } from "react";
import MessageVideoTile from "./MessageVideoTile";

export default function EachMessage(props) {
  const { user } = useContext(context);
  const [show, setShow] = useState(false);

  console.log("mESSAGE", props.info);

  return (
    <div>
      {props.info.tile && (
        <div
          className={
            props.info.senderId == user.uid ? "myVideo" : "friendVideo"
          }
        >
          {props.info.tile.link.includes("www.") ? (
            <iframe
              // ref={iframeRef}
              // className={classes.video}
              width="300"
              height="168"
              src={props.info.tile["link"]}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : (
            <div>
              {!show && (
                <button id="show-mssg-button" onClick={() => setShow(true)}>
                  show Video
                </button>
              )}
              {show && (
                <MessageVideoTile
                  key={Math.random()}
                  id={props.info.tile.link}
                  startTime={props.info.tile.starttime}
                  endTime={props.info.tile.endtime}
                />
              )}
            </div>
          )}
        </div>
      )}
      <div
        className={
          props.info.senderId == user.uid ? "yourMessage" : "friendMessage"
        }
      >
        {props.info.text}
      </div>
    </div>
  );
}
