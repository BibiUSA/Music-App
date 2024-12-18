import { useState, useEffect } from "react";
import axios from "axios";
import Tile from "./Tile";
import { useContext } from "react";
import context from "../contexts/auth/context";

export default function YourPosts() {
  const { user } = useContext(context);

  console.log(user);
  const [fullData, setFullData] = useState([]);
  //trying pagination

  const [offset, setOffset] = useState(0);

  const fetchFeed = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/get/yourposts`, {
        params: { offset: offset, user: user.displayName },
      });
      console.log(response);
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

      // console.log(response.data.rows);
    } catch (error) {
      console.log("fetchFeed err", error);
    }
  };

  //created to avoid duplicates from strictmode
  const uniqueId = [];

  console.log(fullData);

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
  return <div>{spreadTile}</div>;
}
