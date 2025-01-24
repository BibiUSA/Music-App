import "./SearchUser.css";
import { Link } from "react-router-dom";

export default function SearchUser(data) {
  console.log("SEARCH", data);
  const viewProfile = () => {
    console.log("Hey");
    //NEED TO WRITE THE CODE TO VIEW THEIR PROFILE
  };
  return (
    <Link to={`friend/${data.data.username}`}>
      <div className="searchUser" onClick={viewProfile}>
        <img src={data.data.img_url} className="searchImg" />
        <p>{data.data.username}</p>
      </div>
    </Link>
  );
}
