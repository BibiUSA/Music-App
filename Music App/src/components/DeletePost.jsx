import "./DeletePost.css";
import axios from "axios";

export default function DeletePost(data) {
  console.log(data);

  const handleDelete = async (tile_id) => {
    try {
      const result = axios.delete(
        `https://music-app-api-oq6b.onrender.com/create/delete/${tile_id}`,
        {
          tile_id: data.data.tile_id,
        }
      );
      console.log(result);
      data.setShowDel(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="delete-post">
      <h4>Confirm Delete? </h4>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => data.setShowDel(false)}
      >
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => {
          handleDelete(data.data.tile_id);
        }}
      >
        Delete
      </button>
    </div>
  );
}
