import client from "../models/db.js";

export const createPost = async (req, res) => {
  console.log(req.body);
  try {
    const addData = `INSERT INTO tile_info (tile_owner, tile_link, tile_likes, tile_desc, created_date, view_count, replays)
    VALUES ($1, $2, 0, $3, $4, 0, 0);`;
    const values = [
      req.body.owner,
      req.body.link,
      req.body.description,
      req.body.date,
    ];
    const response = await client.query(addData, values);
    res.send({ data: response });
  } catch (error) {
    console.log("createPost err", error);
  }
};

export const likePost = async (req, res) => {
  console.log(req.body);
  try {
    const addData = `INSERT INTO likes (username, tile_id)
    VALUES ($1, $2)`;
    const values = [req.body.username, req.body.tile_id];
    const response = await client.query(addData, values);
    res.send({ data: response });
  } catch (error) {
    console.log(error);
  }
};

export const unLikePost = async (req, res) => {
  console.log(req.params);
  try {
    const addData = `DELETE 
    FROM likes 
    WHERE username = '${req.params.username}' 
    AND tile_id = ${req.params.tile_id}`;
    const response = await client.query(addData);
    res.send({ data: response });
  } catch (error) {
    console.log(error);
  }
};
