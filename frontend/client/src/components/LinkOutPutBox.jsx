//Creates a post.This converts the clip link from youtube into a storable link if valid and posts the data in the database.
import "./LinkOutPutBox.css";
import { useState, useContext } from "react";
import axios from "../config/axios";
import context from "../contexts/auth/context";
import Success from "./Success";

export default function LinkOutPutBox() {
  const [linkInput, setLinkInput] = useState(""); //holds the text inserted in the inputbox
  const [outputLink, setOutputLink] = useState("Outputs Link Here."); //result of the function
  const [desc, setDesc] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useContext(context);

  console.log("LINKOUTPUT", linkInput);
  console.log("LINKDESC", desc);
  console.log("OUTPUT", outputLink);

  //holds entry into textarea
  function handleChange(event) {
    setLinkInput(event);
  }

  function handleDesc(event) {
    setDesc(event);
  }

  //checks to see if link looks real and then convers the entry into just the link that we need
  function convertLink() {
    if (
      linkInput.includes("https") &&
      linkInput.includes("www.youtube.com") &&
      linkInput.includes("clip=") &&
      linkInput.includes("clipt=")
    ) {
      // gets where https start and then get the new link and cuts off before the first quotation
      const sliceStart = linkInput.indexOf("https");
      const tempString = linkInput.slice(sliceStart);
      const sliceEnd = tempString.indexOf(`"`);
      const finalLink = tempString.slice(0, sliceEnd);
      if (
        finalLink.includes("www.youtube.com") &&
        finalLink.includes("clip=") &&
        finalLink.includes("clipt=")
      ) {
        setOutputLink(finalLink);
      } else {
        setOutputLink("support");
      }
    } else {
      //if link is incorrect
      setOutputLink("error");
    }
  }

  const sharePost = async (linked, desc) => {
    const date = new Date();

    if (desc.length < 1) {
      console.log("DEscription here", desc);
      console.log("look at desc", desc);
      return;
    }
    console.log(date);
    try {
      const result = await axios.post(`/create/newpost`, {
        link: linked,
        description: desc,
        owner: user.displayName,
        date: date,
      });
      setSuccess(true);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="linkOutPutBox">
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
      <label>Enter Clip Link Here</label>
      <textarea
        className="insertLink"
        value={linkInput}
        placeholder="Enter Clip Link Here"
        onChange={(event) => {
          handleChange(event.target.value);
        }}
      ></textarea>

      <input
        type="button"
        value="Convert"
        onClick={convertLink}
        className="convert"
      ></input>
      <div className="output">
        {outputLink == "error" && <p>Wrong Link</p>}
        {outputLink.length > 1 &&
          outputLink != "error" &&
          outputLink != "Outputs Link Here." && (
            <>
              <iframe
                className="youtubeVideo"
                width="896"
                height="504"
                src={outputLink}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
              <button
                type="submit"
                className="submit"
                onClick={() => {
                  sharePost(outputLink, desc);
                }}
              >
                Share
              </button>
            </>
          )}
        {outputLink == "support" && (
          <p>Double Check the Link or contact support.</p>
        )}
        {outputLink == "Outputs Link Here." && <p>Outputs Link Here.</p>}
      </div>
      {success && <Success />}
      {/* <label>Private</label> */}
      {/* <input type="checkbox" value="private" name="private"></input> */}
      <br></br>
      {/* <button type="submit" className="submit">
        Share
      </button> */}
    </div>
  );
}
