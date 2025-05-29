import { useState, useContext } from "react";
import axios from "axios";
import context from "../../contexts/auth/context";
import Success from "../../components/Success";
import RegularVideo from "../../components/RegularVideo";
import "./UploadVideo.css";

export default function UploadVideo() {
  //Creates a post.This converts the clip link from youtube into a storable link if valid and posts the data in the database.

  const [linkInput, setLinkInput] = useState(""); //holds the text inserted in the inputbox
  const [outputLink, setOutputLink] = useState("Outputs Link Here."); //result of the function
  const [desc, setDesc] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useContext(context);
  //   const [startTime, setStartTime] = useState({ minute: 0, seconds: 0 });
  //   const [endTime, setEndTime] = useState({ minute: 0, seconds: 10 });
  const [shouldRender, setShouldRender] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  console.log("shouldREnder", shouldRender);
  console.log("renderKey", renderKey);

  //holds entry into textarea
  function handleChange(event) {
    setLinkInput(event);
  }

  function handleDesc(event) {
    setDesc(event);
  }

  function mainUrlConvert(link) {
    const sliceStart = link.indexOf("watch?v=");
    const tempString = link.slice(sliceStart + 8);
    console.log("mainUrlConvert", tempString);
    setOutputLink(tempString);
  }

  function clipEmbedConvert(link) {
    const sliceStart = link.indexOf("https");
    const tempString = link.slice(sliceStart);
    const sliceEnd = tempString.indexOf(`"`);
    let finalLink = tempString.slice(0, sliceEnd);
    setOutputLink(finalLink);
  }

  function youtubeShareUrlConvert(link) {
    const sliceStart = link.indexOf("youtu.be/");
    const tempString = link.slice(sliceStart + 9);
    const sliceEnd = tempString.indexOf(`?`);
    let finalLink = tempString.slice(0, sliceEnd);
    setOutputLink(finalLink);
  }

  //checks to see if link looks real and then convers the entry into just the link that we need
  function convertLink() {
    if (
      linkInput.includes("www.youtube.com") &&
      linkInput.includes("/watch?")
    ) {
      mainUrlConvert(linkInput);
    } else if (
      linkInput.includes("www.youtube.com") &&
      linkInput.includes("clipt=")
    ) {
      clipEmbedConvert(linkInput);
    } else if (linkInput.includes("youtu.be") && linkInput.includes("?")) {
      youtubeShareUrlConvert(linkInput);
    } else {
      //if link is incorrect
      setOutputLink("error");
      setRenderKey(false);
      return;
    }
    setShouldRender(true);
    setRenderKey((prev) => prev + 1);
  }

  const changeSuccess = (data) => {
    setSuccess(data);
    console.log("made it to parent", data);
  };

  return (
    <div className="uploadVideo">
      <h2>Create New Post</h2>
      <textarea
        className="insertDesc"
        placeholder="Enter Description Here"
        value={desc}
        onChange={(event) => {
          handleDesc(event.target.value);
        }}
      ></textarea>
      <br></br>
      {shouldRender && (
        <>
          <RegularVideo
            link={outputLink}
            description={desc}
            changeSuccess={changeSuccess}
          />
        </>
      )}
      <label>Enter Video Link Here</label>
      <textarea
        className="insertLink"
        value={linkInput}
        placeholder="Enter Video Link Here"
        onChange={(event) => {
          handleChange(event.target.value);
        }}
      ></textarea>
      <br></br>

      <input
        type="button"
        value="Convert"
        onClick={convertLink}
        className="convert"
      ></input>
      <div className="output">
        {outputLink == "error" && <p>Wrong Link</p>}

        {outputLink == "support" && (
          <p>Double Check the Link or contact support.</p>
        )}
        {outputLink == "Outputs Link Here." && <p>Outputs Link Here.</p>}
      </div>
      {success && <Success />}

      <br></br>
    </div>
  );
}
