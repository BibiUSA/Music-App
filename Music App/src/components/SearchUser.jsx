import "./SearchUser.css";

export default function SearchUser(data) {
  console.log("SEARCH", data);
  const viewProfile = () => {
    //NEED TO WRITE THE CODE TO VIEW THEIR PROFILE
  };
  return (
    <div className="searchUser" onClick={viewProfile}>
      <img src={data.data.img_url} className="searchImg" />
      <p>{data.data.username}</p>
    </div>
  );
}
