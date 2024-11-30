import "./DeletePost.css";

export default function DeletePost() {
  return (
    <div className="delete-post">
      <h4>Confirm Delete? </h4>
      <button type="button" className="btn btn-primary">
        Cancel
      </button>
      <button type="button" className="btn btn-danger">
        Delete
      </button>
    </div>
  );
}
