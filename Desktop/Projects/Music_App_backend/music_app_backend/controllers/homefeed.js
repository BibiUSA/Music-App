import client from "../models/db.js";
import { likePost } from "./add_tile.js";

export const getFeed = async (req, res) => {
  console.log(req.query);
  try {
    if (req.query.user) {
      const getData = `SELECT first.*, likes.username
FROM
(SELECT t.*, u.img_url
FROM tile_info t
JOIN user_info u
ON t.tile_owner = u.username) as first
LEFT JOIN (SELECT *
FROM likes
WHERE username = '${req.query.user}') as likes 
ON first.tile_id = likes.tile_id
ORDER BY created_date DESC
LIMIT 2
OFFSET ${req.query.offset}`;
      //   `SELECT t.*, likes.username
      // FROM tile_info t
      // LEFT JOIN (SELECT *
      // FROM likes
      // WHERE username = '${req.query.user}') as likes
      // ON t.tile_id = likes.tile_id
      // ORDER BY created_date DESC
      // LIMIT 2
      // OFFSET ${req.query.offset}`;

      const response = await client.query(getData);
      res.send(response);
    } else {
      const getData = `SELECT t.*, u.img_url
FROM tile_info t
JOIN user_info u
ON t.tile_owner = u.username
    ORDER BY created_date DESC
    LIMIT 2
    OFFSET ${req.query.offset}`;
      const response = await client.query(getData);
      res.send(response);
    }
  } catch (error) {
    console.log("getFeed err", error);
  }
};

export const getYourPosts = async (req, res) => {
  console.log("yourpost", req.query);
  try {
    const getData = `SELECT t.*, l.username
FROM (SELECT *
FROM likes
WHERE likes.username = '${req.query.user}') as l
RIGHT JOIN 
(SELECT *
FROM tile_info
WHERE tile_owner = '${req.query.user}') as t
ON l.tile_id = t.tile_id
ORDER BY created_date DESC
    LIMIT 2
    OFFSET ${req.query.offset}`;
    const response = await client.query(getData);
    res.send(response);
  } catch (error) {
    console.log("getFeed err", error);
  }
};
