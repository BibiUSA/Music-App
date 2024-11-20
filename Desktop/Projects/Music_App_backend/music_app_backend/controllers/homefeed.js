import client from "../models/db.js";
import { likePost } from "./add_tile.js";

export const getFeed = async (req, res) => {
  console.log(req.query);
  try {
    const getData = `SELECT * 
    FROM tile_info t
    LEFT JOIN (SELECT *
    FROM likes
    WHERE username = '${req.query.user}') as likes
    ON t.tile_id = likes.tile_id
    ORDER BY created_date DESC
    LIMIT 2
    OFFSET ${req.query.offset}`;

    const response = await client.query(getData);
    res.send(response);
  } catch (error) {
    console.log("getFeed err", error);
  }
};

export const getYourPosts = async (req, res) => {
  console.log(req.query.offset);
  try {
    const getData = `SELECT * FROM tile_info
    WHERE tile_owner = '${req.query.user}'
    ORDER BY created_date DESC
    LIMIT 2
    OFFSET ${req.query.offset}`;
    const response = await client.query(getData);
    res.send(response);
  } catch (error) {
    console.log("getFeed err", error);
  }
};
