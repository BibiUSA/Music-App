//the feed page. contains multiple tiles/videos
import { useState, useEffect, useContext } from "react";
import Tile from "../../components/Tile";
import "./Home.css";
import axios from "axios";
import context from "../../contexts/auth/context";

export default function Home() {
  const [fullData, setFullData] = useState([]);
  //trying pagination
  const [offset, setOffset] = useState(0);
  const { user } = useContext(context);

  console.log(user);

  //pulls the data for the feed, offset amount at a time.
  // Also gets data for the tiles user liked if the useris logged in
  const fetchFeed = async () => {
    try {
      let response;
      if (user) {
        response = await axios.get(`http://localhost:8080/get/`, {
          params: { offset: offset, user: user.displayName },
        });
      } else {
        response = await axios.get(`http://localhost:8080/get/`, {
          params: { offset: offset },
        });
      }
      console.log(response.data.rows);
      if (fullData.length > 1) {
        let newArr = fullData.slice(-2);
        if (newArr[0].tile_id == response.data.rows[0].tile_id) {
          return;
        } else {
          setFullData((prev) => [...prev, ...response.data.rows]);
        }
      } else {
        setFullData((prev) => [...prev, ...response.data.rows]);
      }
    } catch (error) {
      console.log("fetchFeed err", error);
    }
  };

  //created to avoid duplicates from strictmode
  const uniqueId = [];

  const spreadTile = fullData.map((tileData) => {
    if (!uniqueId.includes(tileData.tile_id)) {
      uniqueId.push(tileData.tile_id);
      return <Tile key={tileData.tile_id} data={tileData} />;
    }
  });

  useEffect(() => {
    fetchFeed();
  }, [offset]);

  //used for infinity scroll
  useEffect(() => {
    const handleScroll = (e) => {
      const scrollHeight = e.target.documentElement.scrollHeight;
      const currentHeight =
        e.target.documentElement.scrollTop + window.innerHeight;
      if (currentHeight + 5 >= scrollHeight) {
        setOffset((prev) => prev + 2);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log("Home Page");

  return (
    <div className="home">
      {spreadTile}
      {/* <div className="listOfTiles">
        {fullData.length > 1 &&
          fullData.map((tileData) => <Tile data={tileData} />)}
      </div> */}
      {/* <Tile data={fullD[0]} />
      <Tile data={fullD[1]} />
      <Tile data={fullD[2]} /> */}
    </div>
  );
}
