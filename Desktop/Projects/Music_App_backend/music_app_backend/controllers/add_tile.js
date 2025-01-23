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
    const addData = `WITH inserted AS(
    INSERT INTO likes (username, tile_id)
    VALUES ($1, $2)
    )
    UPDATE tile_info
    SET tile_likes = tile_likes +1
    WHERE tile_id = $2;
    `;
    const values = [req.params.username, req.params.tile_id];
    const response = await client.query(addData, values);
    res.send({ data: response });
  } catch (error) {
    console.log(error);
  }
};

export const unLikePost = async (req, res) => {
  console.log(req.params);
  try {
    const addData = `WITH delete AS (DELETE 
    FROM likes 
    WHERE username = $1 
    AND tile_id = $2)
    UPDATE tile_info
    SET tile_likes = tile_likes -1
    WHERE tile_id = $2;
    `;
    const values = [req.params.username, req.params.tile_id];
    const response = await client.query(addData, values);
    res.send({ data: response });
  } catch (error) {
    console.log(error);
  }
};

export const reportPost = async (req, res) => {
  console.log(req.body);
  try {
    const addData = `INSERT INTO reports
    (tile_id, reported_by, reason)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING;`;
    const values = [req.body.tile_id, req.body.username, req.body.reason];
    const response = await client.query(addData, values);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  console.log("Update", req.body);
  try {
    const addData = `UPDATE tile_info
    SET tile_desc = $1
    WHERE tile_id = $2;`;
    const values = [req.body.tile_desc, req.body.tile_id];
    const response = await client.query(addData, values);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  console.log(req.params);
  try {
    const addData = `DELETE FROM tile_info
    WHERE tile_id = $1;`;
    const values = [req.params.tile_id];
    const response = await client.query(addData, values);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};
