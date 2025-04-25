import "./EachMessage.css";
import context from "../contexts/auth/context";
import { useContext } from "react";
import { environment } from "../environment";

export default function EachMessage(props) {
  const { user } = useContext(context);

  environment.development && console.log("mESSAGE", props.info);

  return (
    <div>
      {props.info.tile && (
        <div
          className={
            props.info.senderId == user.uid ? "myVideo" : "friendVideo"
          }
        >
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
