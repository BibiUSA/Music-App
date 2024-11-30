//Has name of the tileposter /tile owner and the time since it was posted
import { useState, useEffect, useContext } from "react";
import context from "../contexts/auth/context";
import "./TileOWner.css";

export default function TileOwner(data) {
  const tileOwnerData = data.data;
  const ownerName = tileOwnerData.tile_owner;
  const { user } = useContext(context);

  const description = tileOwnerData.tile_desc;
  console.log(tileOwnerData);
  console.log("USER", user);

  const postTimeTwo = () => {
    let temp_date = new Date(tileOwnerData.created_date);
    let today = new Date();
    console.log("CREATED", temp_date);
    let seconds = Math.abs((temp_date - today) / 1000);
    console.log("TODAY", seconds);
    let interval = seconds / 31536000;
    if (interval > 2) {
      return `${Math.floor(interval)} years ago`;
    } else if (interval > 1) {
      return "1 year ago";
    }
    interval = seconds / 2592000;
    if (interval > 2) {
      return `${Math.floor(interval)} months ago`;
    } else if (interval > 1) {
      return "1 month ago";
    }
    interval = seconds / 86400;
    if (interval > 2) {
      return `${Math.floor(interval)} days ago`;
    } else if (interval > 1) {
      return "1 day ago";
    }
    interval = seconds / 3600;
    if (interval > 2) {
      return `${Math.floor(interval)} hours ago`;
    } else if (interval > 1) {
      return "1 hour ago";
    }
    interval = seconds / 60;
    if (interval > 2) {
      return `${Math.floor(interval)} minutes ago`;
    } else if (interval > 1) {
      return "1 minute ago";
    }
    return "0 minute ago";
  };

  // postTimeTwo();

  useEffect(() => {
    postTimeTwo();
  }, []);

  return (
    <div className="tileOwner">
      <div className="tileOwnerInfo">
        <img className="ownerImg" src={tileOwnerData.img_url}></img>
        <div className="ownerText">
          <p className="ownerName">{ownerName}</p>
          <p className="duration">{postTimeTwo()}</p>
        </div>
      </div>
      <p>{description}</p>
    </div>
  );
}
