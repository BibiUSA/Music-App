import client from "../models/db.js";

export const getFeed = async (req, res) => {
  console.log(req.query.offset);
  try {
    const getData = `SELECT * FROM tile_info
    ORDER BY created_date DESC
    LIMIT 2
    OFFSET ${req.query.offset}`;
    const response = await client.query(getData);
    res.send(response);
  } catch (error) {
    console.log("getFeed err", error);
  }
};
