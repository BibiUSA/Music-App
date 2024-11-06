//Has name of the tileposter /tile owner and the time since it was posted
import { useState, useEffect } from "react";
import "./TileOWner.css";

export default function TileOwner(data) {
  const tileOwnerData = data.data;
  const ownerName = tileOwnerData.tile_owner;
  const imgLocation = tileOwnerData.imgLocation;
  const description = tileOwnerData.tile_desc;
  console.log(tileOwnerData);
  const [sincePost, setSincePost] = useState("");

  //to find how long ago the post was created
  const postTime = () => {
    let temp_date = new Date(tileOwnerData.created_date);

    let seconds = Math.abs(Math.floor((new Date() - temp_date) / 1000));
    let interval = seconds / 31536000;
    if (interval > 2) {
      setSincePost(`${Math.floor(interval)} years ago`);
      return;
    } else if (interval > 1) {
      setSincePost("1 year ago");
      return;
    }
    interval = seconds / 2592000;
    if (interval > 2) {
      setSincePost(`${Math.floor(interval)} months ago`);
      return;
    } else if (interval > 1) {
      setSincePost("1 month ago");
      return;
    }
    interval = seconds / 86400;
    if (interval > 2) {
      setSincePost(`${Math.floor(interval)} days ago`);
      return;
    } else if (interval > 1) {
      setSincePost("1 day ago");
      return;
    }
    interval = seconds / 3600;
    if (interval > 2) {
      setSincePost(`${Math.floor(interval)} hours ago`);
      return;
    } else if (interval > 1) {
      setSincePost("1 hour ago");
      return;
    }
    interval = seconds / 60;
    if (interval > 2) {
      setSincePost(`${Math.floor(interval)} minutes ago`);
      return;
    } else if (interval > 1) {
      setSincePost("1 minute ago");
      return;
    }
    setSincePost("0 minute ago");
    return;
  };

  useEffect(() => {
    postTime();
  }, []);

  return (
    <div className="tileOwner">
      <div className="tileOwnerInfo">
        <img className="ownerImg" src={imgLocation}></img>
        <div className="ownerText">
          <p className="ownerName">{ownerName}</p>
          <p className="duration">{sincePost}</p>
        </div>
      </div>
      <p>{description}</p>
    </div>
  );
}
