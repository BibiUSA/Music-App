import client from "../models/db.js";
import { environment } from "../../frontend/client/src/environment.js";

export const getFeed = async (req, res) => {
  environment.development && console.log(req.query);
  try {
    if (req.query.user && req.query.feedChoice == "Recent") {
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
    } else if (req.query.user && req.query.feedChoice == "Friends") {
      environment.development && console.log("FRIENDS FEED");
      const getData = `SELECT feed.*, likes.* FROM (SELECT item.*, u.img_url 
 FROM (SELECT *
      FROM tile_info 
      WHERE tile_owner IN (SELECT friend1 
    FROM connections where friend2 = '${req.query.user}'
    AND accept1 = TRUE
    AND accept2 = TRUE)
    OR tile_owner IN (SELECT friend2 
    FROM connections where friend1 = '${req.query.user}'
    AND accept1 = TRUE
    AND accept2 = TRUE)) as item
 	JOIN user_info u
	ON item.tile_owner = u.username)as feed
	LEFT JOIN (SELECT *
FROM likes
WHERE username = '${req.query.user}') as likes 
ON feed.tile_id = likes.tile_id
ORDER BY created_date DESC
LIMIT 2
    OFFSET ${req.query.offset}`;
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
    environment.development && console.log("getFeed err", error);
  }
};

export const getYourPosts = async (req, res) => {
  environment.development && console.log("yourpost", req.query);
  try {
    const getData = `SELECT t.*, l.username, u.img_url
FROM (SELECT *
FROM likes
WHERE likes.username = '${req.query.user}') as l
RIGHT JOIN 
(SELECT *
FROM tile_info
WHERE tile_owner = '${req.query.feedPerson}') as t
ON l.tile_id = t.tile_id
LEFT JOIN user_info u
ON u.username = t.tile_owner
ORDER BY created_date DESC
    LIMIT 2
    OFFSET ${req.query.offset}`;
    const response = await client.query(getData);
    res.send(response);
  } catch (error) {
    environment.development && console.log("getFeed err", error);
  }
};
