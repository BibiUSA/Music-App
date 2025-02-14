//the feed page. contains multiple tiles/videos
import { useState, useEffect, useContext } from "react";
import Tile from "../../components/Tile";
import "./Home.css";
import context from "../../contexts/auth/context";
import useGet from "../../hooks/useGet";
import { redirect } from "react-router-dom";
import { IconAdjustments } from "@tabler/icons-react";
import { setLogLevel } from "firebase/app";

export default function Home() {
  const [fullData, setFullData] = useState([]);
  console.log("FULLDATA", fullData);
  const [feedSelection, setFeedSelection] = useState(false);
  //choosing the feed algorithm
  const [feedChoice, setFeedChoice] = useState("Recent");
  //trying pagination
  const { user } = useContext(context);

  if (!user) {
    window.location = "/login";
  }
  const { err, loading, get } = useGet({
    api: "get/",
    params: user
      ? { offset: 0, user: user.displayName, feedChoice: feedChoice }
      : { offset: 0 },
    // deps: [offset],
    cb: (res) => {
      //part of this might have been built to deal with StrictMode
      if (fullData.length > 1) {
        console.log("fulldata", fullData);
        let newArr = fullData.slice(-2);
        if (newArr[0].tile_id == res.data.rows[0].tile_id) {
          return;
        } else {
          setFullData((prev) => [...prev, ...res.data.rows]);
        }
      } else {
        console.log("fulldata", res.data.rows);
        setFullData((prev) => [...prev, ...res.data.rows]);
      }
    },
  });

  useEffect(() => {
    if (!user) {
      return <redirect to="login" />;
    }
    let offset = 0;
    const handleScroll = (e) => {
      const scrollHeight = e.target.documentElement.scrollHeight;
      const currentHeight =
        e.target.documentElement.scrollTop + window.innerHeight;
      if (currentHeight + 5 >= scrollHeight) {
        offset += 2;
        console.log("OFFSET", offset);
        get({ offset });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (err) {
    return (
      <h3 className="text-danger">
        {err.data?.response?.message || err.message}
      </h3>
    );
  }

  //created to avoid duplicates from strictmode
  const uniqueId = [];

  //used to get data for the tile and map it
  const spreadTile = fullData.map((tileData) => {
    console.log(tileData);
    console.log("ID", uniqueId);
    if (!uniqueId.includes(tileData.tile_id)) {
      uniqueId.push(tileData.tile_id);
      console.log("TILE", tileData.tile_id);
      return <Tile key={tileData.tile_id} data={tileData} />;
    }
  });

  return (
    <div className="home">
      <div
        className="feedOptions"
        onClick={() => setFeedSelection((prev) => !prev)}
      >
        <section className="feedSetting">
          <p>{feedChoice}</p>
          <IconAdjustments stroke={2} />
        </section>
      </div>
      {feedSelection && (
        <div className="feed-dropdown">
          <div className="feed-title">Sort By</div>
          <div
            className="feed-pick"
            onClick={() => {
              setFeedChoice("Recent");
              setFeedSelection(false);
            }}
          >
            Recent
          </div>
          <div
            className="feed-pick"
            onClick={() => {
              setFeedChoice("Friends");
              setFeedSelection(false);
            }}
          >
            Friends
          </div>
        </div>
      )}
      {spreadTile}
      {loading && (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )}
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
