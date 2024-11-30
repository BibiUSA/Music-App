import { useState } from "react";
import "./EditPost.css";

export default function EditPost(data) {
  console.log("EDITPOST", data);
  const [desc, setDesc] = useState(data.data.tile_desc);

  return (
    <div className="edit-post">
      <textarea
        type="texarea"
        id="edit-captions"
        value={desc}
        onChange={(event) => setDesc(event.target.value)}
      />
      <label htmlFor="edit-captions"></label>
    </div>
  );
}
