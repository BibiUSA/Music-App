import { useState } from "react";
import "./EditPost.css";
import axios from "../config/axios";

export default function EditPost(data) {
  console.log("EDITPOST", data.data.tile_desc);
  const [desc, setDesc] = useState(data.data.tile_desc);

  const updatePost = async () => {
    try {
      const result = axios.patch(`/create/edit`, {
        tile_desc: desc,
        tile_id: data.data.tile_id,
      });
      console.log(result);
      data.setShowEdit(false);
    } catch (error) {
      console.log(error);
    }
    console.log("hellp");
  };

  return (
    <div className="edit-post-box">
      <div className="edit-post">
        <textarea
          className="text"
          type="texarea"
          id="edit-captions"
          value={desc}
          onChange={(event) => setDesc(event.target.value)}
        />
        <label htmlFor="edit-captions"></label>
      </div>
      <div className="buttons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => data.setShowEdit(false)}
        >
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={updatePost}>
          Update
        </button>
      </div>
    </div>
  );
}
